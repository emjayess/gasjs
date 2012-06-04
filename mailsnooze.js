var MARK_UNREAD = false
, ADD_UNSNOOZED_LABEL = true
, SNOOZE_DAYS = 30;

function setup() {
  // Create the labels we’ll need for snoozing
  GmailApp.createLabel("Snooze");
  for (var i = 1; i <= SNOOZE_DAYS; ++i) {
    GmailApp.createLabel(getLabelName(i));
  }
  if (ADD_UNSNOOZED_LABEL) {
    GmailApp.createLabel("Snooze/Unsnoozed");
  }
}

function getLabelName(i) {
  return "Snooze/" + i + " days";
}

function moveSnoozes() {
  var oldLabel, newLabel, page;
  for (var i = 1; i <= SNOOZE_DAYS; ++i) {
    newLabel = oldLabel;
    oldLabel = GmailApp.getUserLabelByName(getLabelName(i));
    page = null;
    // Get threads in "pages" of 100 at a time
    while(!page || page.length == 100) {
      page = oldLabel.getThreads(0, 100);
      if (page.length > 0) {
        if (newLabel) {
          // Move the threads into "today’s" label
          newLabel.addToThreads(page);
        } else {
          // Unless it’s time to unsnooze it
          GmailApp.moveThreadsToInbox(page);
          if (MARK_UNREAD) {
            GmailApp.markThreadsUnread(page);
          }
          if (ADD_UNSNOOZED_LABEL) {
            GmailApp.getUserLabelByName("Unsnoozed")
              .addToThreads(page);
          }          
        }     
        // Move the threads out of "yesterday’s" label
        oldLabel.removeFromThreads(page);
      }  
    }
  }
}