
function doGet(e) {
    return HtmlService.createHtmlOutput("GET request received - The script is working!");
}

function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cycle-III Data");


    // Extract data from the request
    var data = e.parameter;
    var row = [];

    // Define internal names and human-readable headers
    var config = [
        { field: 'timestamp', label: 'Date & Time' },
        { field: 'principal_name', label: 'Name' },
        { field: 'designation', label: 'Designation ' },
        { field: 'email_id', label: 'Email-Id' },
        { field: 'branch', label: 'Branch' },
        { field: 'session_progress_rating', label: 'How would you rate the overall progress of Wizklub sessions during the year?' },
        { field: 'session_regularity', label: 'Were the Wizklub sessions conducted regularly and as per schedule?' },
        { field: 'trainer_effectiveness', label: 'How well did the Wizklub trainer exhibit subject expertise and manage the classroom environment?' },
        { field: 'wizklub_day_status', label: 'Were the projects exhibited on during exclusive Wizklub Day or in collaboration with Science Day?' },
        { field: 'exhibit_learning', label: 'The exhibition helped students demonstrate learning and creativity' },
        { field: 'exhibit_confidence', label: 'Students were confident while explaining projects' },
        { field: 'exhibition_prep_rating', label: 'How would you rate the overall Wizklub project preparation at your school?' },
        { field: 'parents_engagement', label: 'How was the parents’ engagement and response for the project exhibition?' },
        { field: 'exhibition_best_part', label: 'What did you like most about the exhibition?' },
        { field: 'recommend_wizklub', label: 'Would you recommend Wizklub to other schools?' },
        { field: 'renewal_expectation_v2', label: 'According to you, what percentage of renewal is expected for the next academic year? (Non Mavericks students renewing for AY 26-27)' },
        { field: 'adoption_calls_permission', label: 'We have observed higher enrollment rates when class teachers speak directly with parents about the Wizklub program. Would you support involving your class teachers in these conversations during our admissions?' },
        { field: 'areas_of_improvement', label: 'What are the areas of improvement?' }
    ];

    // If the sheet is empty, add the headers first
    if (sheet.getLastRow() === 0) {
        var headers = config.map(function (item) { return item.label; });
        sheet.appendRow(headers);

        // Optional: Make headers bold
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
    }

    // Map incoming data to the defined columns
    for (var i = 0; i < config.length; i++) {
        row.push(data[config[i].field] || "");
    }

    // Append row to the sheet
    sheet.appendRow(row);

    // Return success response
    return ContentService.createTextOutput("Success")
        .setMimeType(ContentService.MimeType.TEXT);
}
