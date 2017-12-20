var request = require('request');

var attendance = {};

function pullAttendance(eventId)
{
    request.get(`https://api.meetup.com/code-with-me/events/${eventId}/attendance?page=200&sign=true`, function(error, response, body) {
         console.log("ERR: "+error);
        console.log(body);
        var attendenceData = JSON.parse(body);
        
        for(var item in attendenceData)
        {
            var name = attendenceData[item].member.name;
            attendance[name] = attendance[name] || { count: 0 };
            attendance[name].count++;
        }
        fs.writeFile('event-'+eventId+'.json', body, function(err, data) {});

        console.log();
        console.log();
        console.log("RSVPS");
        for (var person in attendance)
        {
            console.log(`${person},${attendance[person].count}`);
        }
      });
}

var fs = require('fs')
fs.readFile('events.json', 'utf8', function (err, data) {
  if (err) throw err;
  var eventData = JSON.parse(data);
  var totalRsvp = 0;
  var totalEvents = 0;
  var venues = {};
  var eventIds = [];
  var attendance = {};
  for (var e in eventData)
  {
      var event = eventData[e];
      var venue =  event.venue.name;      
      if (venue === "Tysons-Pimmit Regional Library")
        venue = "Tysons-Pimmit Library";
      var rsvp_yes = event.yes_rsvp_count;

      eventIds.push(event.id);

      console.log(`${rsvp_yes}\t${event.name}\t[${venue}]\t${event.id}`);

      venues[venue] = (venues[venue] || { count: 0, rsvp: 0});
      venues[venue].count++;
      venues[venue].rsvp += rsvp_yes;
      totalRsvp += rsvp_yes;
      totalEvents++;

        pullAttendance(event.id);
  }

  console.log();
  console.log(`Total Meetups: ${totalEvents}`);
  console.log(`Average RSVP YES rate: ${totalRsvp/totalEvents}`);


  var maxLocationCount = 11
  for(var location in venues)
  {
    
    var bars = "";
    for(var i = 0;i < maxLocationCount - venues[location].count; i++)
        bars += " ";
    for(var i = 0;i < venues[location].count; i++)
        bars += String.fromCharCode(9618);
    console.log(bars + "   [" + venues[location].count + " mtgs ]  " +location);
  }  
});

