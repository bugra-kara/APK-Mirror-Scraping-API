const axios = require('axios')
const cheerio = require("cheerio");

const idConvert = (id) => {
 return id.replaceAll('-','.')
}
const handleRefresh = async () => {
 const versionsData = []
 for(var i = 1; versionsData.length < 10; i++) {
  //get every page's data
  const {data} = await axios.get(`https://www.apkmirror.com/uploads/page/${i}/?appcategory=instagram-instagram`)
  const $ = cheerio.load(data);

  //query for table's row
  $('.listWidget > div > div.appRow > div.table-row').each(async (_idx, el)=> {
   const page = $(el);
   let dataToSend = {
    version_id: '',
    release_date: '',
    v_variants: []
   }
   if((versionsData.length < 10 && page.find('a.fontBlack').text().search('Instagram') !== -1)&&((page.find('a.fontBlack').text().search('alpha') === -1) && (page.find('a.fontBlack').text().search('beta') === -1)))
    {
      //set version_id and release_date
      dataToSend.version_id = page.find('a.fontBlack').text().replace('Instagram ', '')
      dataToSend.release_date = new Date(page.find('span > [data-utcdate]').data().utcdate)

      //get every variant's data
      let {data} = await axios.get(`https://www.apkmirror.com${page.find('a.fontBlack').attr('href')}`)
      const $d = cheerio.load(data);

      //query for each variant's data
      $d('#content > div:nth-child(6) > div:nth-child(3) > div > div').each((_idx, el)=> {
       const dtitle = $d(el)
       if(dtitle.find('div:nth-child(1) > span.colorLightBlack:first').text() !== '') {
        let mav = parseInt(dtitle.find('div:nth-child(3)').text().replaceAll(/Android|[+]|/g, '')) //remove Android string and + char
        let sdpin = dtitle.find('div:nth-child(4)').text().replace('dpi', '').split('-') // remove dpi and split dpis
        dataToSend.v_variants.push({
         variant_id: dtitle.find('div:nth-child(1) > span.colorLightBlack:first').text(),
         architecture: dtitle.find('div:nth-child(2)').text(),
         min_android_version: mav,
         screen_dpi: sdpin
        })
       }
      }
     )
     versionsData.push(dataToSend); //push data to array
   }
  })
}
 return versionsData
}

const handleUserCheck = (agent) => {
 //parse the data for user informations to check
 const newAgent = agent.replaceAll(/;|[(]|[)]/g, '').split(' '); 
 const user = {
  version_id: newAgent[1],
  variant_id: parseInt(newAgent[11]),
  android_version: parseInt(newAgent[3].split('/')[1]),
  screen_dpi: newAgent[4].replace('dpi', '')
 }
 return user
}

module.exports = {
 idConvert,
 handleRefresh,
 handleUserCheck
}