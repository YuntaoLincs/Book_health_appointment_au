const puppeteer = require("puppeteer");

async function run(input, locationNumber, postcode, requireDate) {
  const browser = await puppeteer.launch({ headless: false });
  //const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Add a debugger statement to pause execution here
  //debugger;
  try {
    await page.goto("https://bmvs.onlineappointmentscheduling.net.au/oasis/");
    await page.click("#ContentPlaceHolder1_btnMod");
    await page.waitForSelector("#txtEmail");
    await page.focus("#txtEmail");
    await page.keyboard.type(`${input.textEmail}`);

    await page.waitForSelector("#txtFirstName");
    await page.focus("#txtFirstName");
    await page.keyboard.type(`${input.textFirstName}`);

    await page.waitForSelector("#txtSurname");
    await page.focus("#txtSurname");
    await page.keyboard.type(`${input.textSurname}`);

    await page.waitForSelector("#txtDOB");
    await page.focus("#txtDOB");
    await page.keyboard.type(`${input.textDOB}`);

    await page.waitForSelector("#ContentPlaceHolder1_btnSearch");
    await page.click("#ContentPlaceHolder1_btnSearch");

    await page.waitForSelector(
      "#ContentPlaceHolder1_repAppointments_lnkChangeAppointment_0"
    );
    await page.click(
      "#ContentPlaceHolder1_repAppointments_lnkChangeAppointment_0"
    );

    await page.waitForSelector(
      "#ContentPlaceHolder1_SelectLocation1_txtSuburb"
    );
    // await page.focus("#ContentPlaceHolder1_SelectLocation1_txtSuburb");
    // await page.keyboard.type(`${postcode}`);

    // await page.waitForSelector(".postcode-search > .blue-button");
    // await page.click(".postcode-search > .blue-button");

    // //await page.waitForSelector(":nth-child(2) > .trlocation > .tdloc_checkbox");
    // //await page.click(":nth-child(2) > .trlocation > .tdloc_checkbox");
    // //await page.waitForSelector("#rbLocation135");
    // //await page.click("#rbLocation135");
    // await page.waitForSelector(`#rbLocation${locationNumber}`);
    // await page.click(`#rbLocation${locationNumber}`);

    await page.waitForSelector(".white");
    await page.click(".white");
    //<div id="divPaginationNavigation" style="text-align: center;"><button type="button" data-value="8/03/2024" data-val="0" class="pagination-navigation-btn active ">Fri <br> 8 Mar</button><button type="button" data-value="11/03/2024" data-val="1" class="pagination-navigation-btn  ">Mon <br> 11 Mar</button></div>
    const divElement = await page.waitForSelector("#divPaginationNavigation");

    // await page.waitForSelector('[data-value="11/03/2024"]');
    // await page.click('[data-value="11/03/2024"]');

    const dataValues = await page.evaluate(() => {
      const buttons = Array.from(
        document.querySelectorAll("#divPaginationNavigation button")
      );
      return buttons.map((button) => button.getAttribute("data-value"));
    });
    const requireTime = [
      // "9:00 AM",
      // "9:15 AM",
      // "9:30 AM",
      // "9:45 AM",
      "10:00 AM",
      "10:15 AM",
      "10:30 AM",
      "10:45 AM",
      "11:00 AM",
      "11:15 AM",
      "11:30 AM",
      "11:45 AM",
      "12:00 PM",
      "12:15 PM",
      "12:30 PM",
      "12:45 PM",
      "1:00 PM",
      "1:15 PM",
      "1:30 PM",
      "1:45 PM",
      "2:00 PM",
      //"2:15 PM",
      //"2:30 PM",
      //"2:45 PM",
      //"3:00 PM",
      //"3:15 PM",
      //"3:30 PM",
      //"3:45 PM",
      //"4:00 PM",
      //"4:15 PM",
      //"4:30 PM",
      //"4:45 PM",
      //"5:00 PM",
    ];
    const requireTimeR = requireTime.reverse();
    const date = requireDate.find((date) => dataValues.includes(date));
    if (date) {
      try {
        await page.waitForSelector(`[data-value="${date}"]`);
        await page.click(`[data-value="${date}"]`);

        // Try to click each time button until one is successful
        for (const time of requireTimeR) {
          const timeSelector = `[data-text="${time}"]`;

          try {
            await page.waitForSelector(timeSelector, { timeout: 1000 }); // Adjust timeout as needed
            await page.click(timeSelector);
            // If the click is successful, break out of the loop
            console.log("click time success");
            await page.waitForSelector("#ContentPlaceHolder1_btnCont");
            await page.click("#ContentPlaceHolder1_btnCont");

            await page.waitForSelector('[type="button"]');
            await page.click('[type="button"]');

            await browser.close();
            return true;
          } catch (timeClickError) {
            console.error(
              `Failed to click time ${time}: ${timeClickError.message}`
            );
            // Handle the error or continue to the next time
          }
        }
      } catch (dateClickError) {
        console.error(
          `Failed to click date ${date}: ${dateClickError.message}`
        );
        // Handle the error or proceed to the next date
      }
      //revesaly click the time button, if the time button is not available, click the next date button
    }
    await browser.close();
    return false;
  } catch (e) {
    console.log(e);
    await browser.close();
    return false;
  }
}

// Syndey 168, NSW 2000
async function runSequentially() {
  let tryTime = 0;
  const personalInfo = {
    textEmail: "",
    textFirstName: "",
    textSurname: "",
    textDOB: "",
  };
  const postcode = 2000;
  const locationNumber = 168;
  const requireDate = [
    //"05/02/2024",
    //"06/02/2024",
    //"07/02/2024",
    //"08/02/2024",
    //"09/02/2024",
    //"10/02/2024",
    "23/05/2024",
    "24/05/2024",
    "25/05/2024",
    "26/05/2024",
    "27/05/2024",
    "28/05/2024",
    "29/05/2024",
    "30/05/2024",

    // "11/03/2024",
    // "18/03/2024",
    // "28/03/2024",
  ];
  while (true) {
    const r = await run(personalInfo, locationNumber, postcode, requireDate);
    //const r = await run(62, 5000);
    tryTime++;
    console.log(`tryTime: ${tryTime}`);
    if (r) {
      break;
    }
  }
}

runSequentially();
