var MARK_UNREAD = false
  , SNOOZE_DAYS = 30
  , ADD_UNSNOOZED_LABEL = true
  , UNSNOOZED_LABEL = 'Snooze/Unsnoozed'
;

function setup() {
  // Create the labels we’ll need for snoozing
  GmailApp.createLabel("Snooze");
  for (var i = 1; i <= SNOOZE_DAYS; ++i) {
    GmailApp.createLabel(getLabelName(i));
  }
  if ( ADD_UNSNOOZED_LABEL ) {
    GmailApp.createLabel( UNSNOOZED_LABEL );
  }
}

function getLabelName(i) {
  return "Snooze/" + i + " days";
}

function moveSnoozes() {
  var oldLabel
    , newLabel
    , page, pagesize = 25
  ;
  
  /**
   * Get threads in "pages" of {pagesize} at a time
   * loop over ever 'snooze day' page, to re-process
   * and move mails up accordingly
   */
  for (var i = 1; i <= SNOOZE_DAYS; ++i) {
    var newLabel  = oldLabel
      , oldLabel  = GmailApp.getUserLabelByName(getLabelName(i))
    ;
    
    while( ! page || page.length == pagesize ) {
      page = oldLabel.getThreads(0, pagesize);
      
      if ( page.length > 0 ) {
        if ( newLabel ) {
          // Move the threads into "today’s" label
          newLabel . addToThreads( page );
        } 
        else {
          // Unless it’s time to unsnooze it
          GmailApp . moveThreadsToInbox( page );
          if ( MARK_UNREAD ) GmailApp . markThreadsUnread( page );
          if ( ADD_UNSNOOZED_LABEL ) GmailApp . getUserLabelByName( UNSNOOZED_LABEL ) . addToThreads( page );
        }
        
        // Move / remove out of "yesterday’s" label
        oldLabel.removeFromThreads( page );
      }  
    }
  }
}
