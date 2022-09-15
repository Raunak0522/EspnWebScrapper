// const url =  "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

const request = require("request");
const cheerio = require("cheerio");
const path= require("path")
const fs=require("fs")
const xlsx=require("xlsx")

function procesScorecard(url) {
  request(url, cb);
}

function cb(error, response, html) {
  if (error) {
    console.log(error);
  } else {
    getMatchdetails(html);
  }
}
function getMatchdetails(html) {
  //venue & match details
  let $ = cheerio.load(html);

  let details = $("div.ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
  let splitArr = details.text().split(","); //split the string into array

  let Matchno = splitArr[0].trim();
  let Venue = splitArr[1].trim();
  let Date = splitArr[2] + "," + splitArr[3].trim();

  let results = $(
    "p.ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title"
  );

  let Results = results.text();

  //table s data extraction
  let innings = $("div.ds-bg-fill-content-prime.ds-rounded-lg");

  let htmlString = " ";

  for (let i = 0; i < innings.length; i++) {
    htmlString += $(innings[i]).html(); //the data for the table is extracted using segregation method

    let teamsname = $(innings[i])
      .find("span.ds-text-tight-s.ds-font-bold.ds-uppercase")
      .text();
    teamsname = teamsname.split("INNINGS")[0].trim();

    let opponentIndex = i == 0 ? 1 : 0; //ternary operator -short hand if-else

    let opponentName = $(innings[opponentIndex])
      .find("span.ds-text-tight-s.ds-font-bold.ds-uppercase")
      .text();
    opponentName = opponentName.split("INNINGS")[0].trim();

    console.log(Venue);
    console.log(Date);
    console.log(Results);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    let cInn = $(innings[i]); //first inning k data k lia

    let allRows = cInn.find(
      "table.ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table tbody tr.ds-border-b.ds-border-line.ds-text-tight-s"
    ); //all batsman data table identification first inning

    for (let j = 0; j < allRows.length; j++) {
      let allcols = $(allRows[j]).find("td"); //done teams k batsman k data a gya h isee ab osme s filter krna hai

      let check = $(allcols[0]).hasClass("ds-min-w-max");
      if (check == true) {
        let playerName = $(allcols[0]).text().trim();
        let runs = $(allcols[2]).text().trim();
        let balls = $(allcols[3]).text().trim();
        let fours = $(allcols[5]).text().trim();
        let sixes = $(allcols[6]).text().trim();
        let STR = $(allcols[7]).text().trim();
        console.log(playerName +  "|" + runs +"|" +balls +"|" + fours + "|" + sixes + "|" + STR );

        processPlayer(teamsname,playerName,runs,balls,fours,sixes,STR,opponentName,Venue,Results,Date)
      }
    }
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

    //  console.log(teamsname,opponentName,Venue,Date,Results)
  }
}

function processPlayer(teamsname,playerName,runs,balls,fours,sixes,STR,opponentName,Venue,Results,Date){
  let teamPath=path.join(__dirname,"IPL",teamsname)
  dirCreator(teamPath)

  let filepath=path.join(teamPath,playerName+".xlsx")
  let content=excelReader(filepath,playerName)

  let playerObj={
    teamsname,
    playerName,
    runs, 
    balls,
    fours, 
    sixes,
    STR,
    opponentName,
    Venue,
    Results,Date
  }

  content.push(playerObj)
  excelWriter(filepath,content,playerName)
}

function dirCreator(filepath){
  if(fs.existsSync(filepath)==false){
      fs.mkdirSync(filepath)
  }
}

function excelWriter(filepath,jsondata,sheetName){
  //function to use xlsx library
  
  let newWB = xlsx.utils.book_new(); //new workbook
  let newWS = xlsx.utils.json_to_sheet(jsondata); //this will take json data and convert into excel sheet
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filepath);
}

function excelReader(filepath,sheetName){
  // function to use read the xlsx file

  if(fs.existsSync(filepath)==false){//to check the path exists or not
    return[];
  }
  
  let wb = xlsx.readFile(filepath);//which excel file to read
  let excelData = wb.Sheets[sheetName];//pass the sheet name
  let ans = xlsx.utils.sheet_to_json(excelData);//ab excel ko json m convert kia
  console.log(ans);
}


module.exports = {
  ps: procesScorecard,
};
