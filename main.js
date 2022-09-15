const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595"

const request=require("request")
const cheerio=require("cheerio")


const allmatchObj=require("./allMatch")

const fs=require("fs")

const path=require("path")

let iplPath=path.join(__dirname,"IPL")//dirname gives the path of the current directory you have.


function dirCreator(filepath){
    if(fs.existsSync(filepath)==false){
        fs.mkdirSync(filepath)
    }

}

dirCreator(iplPath)

request(url,cb);

function cb(error,response,html){
    if (error){
        console.log(error)
    }
    else{
        extractLink(html)
    }
}
function extractLink(html){
    let $=cheerio.load(html)

  
      let contentArr=$("a.ds-block.ds-text-center.ds-uppercase.ds-text-ui-typo-primary")
    // let contentArr=$("a.ds-inline-flex.ds-items-start.ds-leading-none")


    let link= contentArr.attr("href")
   

    let fullink="https://www.espncricinfo.com/"+link
    console.log(fullink)
  
   allmatchObj.getAllmatch(fullink)
}



