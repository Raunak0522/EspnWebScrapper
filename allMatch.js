const cheerio =require("cheerio")
const request =require("request")

const scorecardObj=require("./scorecard")



function getfullmatchLink(uri)
{
    request(uri,cb2)
    function cb2(error,response,html1){
        if(error){
            console.log(error)
        }
        else{
            getscorecardLink(html1)
        }
    }

}

function getscorecardLink(html1)
{
    let $=cheerio.load(html1)

  
    let contentArr=$('div.ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent a')

    for(let i=2;i<contentArr.length;i=i+4){
             let data=$(contentArr[i]).attr("href")//text nhi lagaoge toh by default text format m dega.
             let fullink= "https://www.espncricinfo.com/"+data
            
             scorecardObj.ps(fullink)
        }
}

module.exports={
    getAllmatch : getfullmatchLink
}