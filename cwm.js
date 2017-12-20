var http = require('http');

var parseAndPrint = function (eventData) {
    var totalRsvp = 0;
    var totalEvents = 0;
    var venues = {};
    for (var e in eventData)
    {
        var event = eventData[e];
        var venue =  event.venue.name;      
        if (venue === "Tysons-Pimmit Regional Library")
        venue = "Tysons-Pimmit Library";
        var rsvp_yes = event.yes_rsvp_count;

        console.log(`${rsvp_yes}\t${event.name}\t[${venue}]`);

        venues[venue] = (venues[venue] || { count: 0, rsvp: 0});
        venues[venue].count++;
        venues[venue].rsvp += rsvp_yes;
        totalRsvp += rsvp_yes;
        totalEvents++;
    }

    console.log();
    console.log(`Total Meetups: ${totalEvents}`);
    console.log(`Average RSVP YES rate: ${totalRsvp/totalEvents}`);
    console.log();
    
    for(var location in venues)
    {    
        console.log("[" + venues[location].count + " mtgs ]  " +location);
    }

}


http.get("http://api.meetup.com/code-with-me/events?&sign=true&photo-host=public&status=past", function(res) {

    var body = "";
    res.on("data", function(d) {
        body += d;
    });

    res.on("end", function() {
        try {
            var eventData = JSON.parse(body);
            parseAndPrint(eventData);

        } catch (err) {
            console.error('Unable to parse response as JSON', err);
        }
    });
});

