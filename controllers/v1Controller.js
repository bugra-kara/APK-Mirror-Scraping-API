const Versions = require('../models/versions');
const { idConvert, handleRefresh, handleUserCheck } = require("../services");

const refreshData = async (req,res) => {
 try {
    const versionsData = await handleRefresh();
    const latiestData = await Versions.find(); //check if data exists
    //if data exist filter the data and remove duplicates
    if(latiestData.length !== 0) {
     versionsData.map(async(item)=> {
      const result = latiestData.filter((item2)=>{
       return item2?.version_id === item.version_id
      })
      result.length > 0 ? item : await Versions.create(item)
     })
     res.json({result:"success", data: versionsData})
    }
   //if data doesnt exist just create it
   else {
    versionsData.map(async(item)=> {
     await Versions.create(item)
    })
    res.json({result:"success", data: versionsData})
   }
 } catch (error) {
  res.json({result:"failed", error: error})
 }
}
const allVersions = async (req, res) => {
 try {
  const response = await Versions.aggregate([
   {
    $project: {
     version_id: 1,
     release_date: 1,
     numberOfVariants: {$size: ["$v_variants"]}}
   },
   { 
    $sort : { 
     release_date : -1
    }
   },
   {
    $limit: 10
   }
  ])
  res.json({result: "success", data: response})
 } catch (error) {
  res.json({result: "failed", error: error})
 }
}

const singleVersion = async (req, res) => {
 const {id} = req.params;
 const newId = idConvert(id)
 try {
  const response = await Versions.findOne({version_id: newId})
  res.json({result: "success", data: response})
 } catch (error) {
  res.json({result: "failed", error: error})
 }
}

const updateSingleVersion = async (req, res) => {
 const { id } = req.params;
 const newId = idConvert(id)
 const { version_id, release_date, v_variants } = req.body
 try {
  await Versions.updateOne({version_id: newId},{version_id: version_id, release_date: release_date, v_variants: v_variants})
  res.json({result: "success"})
 } catch (error) {
  res.json({result: "failed", error: error})
 }
}

const delSingleVersion = async (req, res) => {
 const {id} = req.params;
 const newId = idConvert(id)
 try {
  await Versions.deleteOne({version_id: newId})
  res.json({result: "success"})
 } catch (error) {
  res.json({result: "failed", error: error})
 }
}

const checkUserVersion = async (req, res) => {
 const {agent} = req.params
 const user = handleUserCheck(agent)
 //check user's variant_id if it exist
 const response = await Versions.aggregate([
  {
   $match: {
    v_variants: {
     $elemMatch: {
      variant_id: user.variant_id
     }
    }
   }
  },
 {
  $project: {
   v_variants: 1
  }
 }
 ])
 const comparedArray = response[0]?.v_variants.filter((item)=>{return item?.variant_id === user?.variant_id}) //get matching variant(s)
 if((comparedArray !== undefined && comparedArray.length > 0) && (user.android_version >= comparedArray[0]?.min_android_version && comparedArray[0]?.screen_dpi.some((e)=>parseInt(e)<=parseInt(user.screen_dpi)))){
  res.json({result: "success"})
 }
 else {
  res.json({result: "failed"})
 }
}

module.exports = {
 refreshData,
 allVersions,
 singleVersion,
 updateSingleVersion,
 delSingleVersion,
 checkUserVersion
}