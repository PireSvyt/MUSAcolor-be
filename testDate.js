



function attemptsMeetThreshold (attempts) {
    //console.log("attemptsMeetThreshold", attempts)
    let meetsThreshold = true
    let thresholdDate = Date.now()

    if (attempts !== undefined) {
        // Filter attempts
        let threshold = {
            attempts: 3, // attempts per 
            duration: 1 // minutes
        }
        var diffMinutes = new Date
        diffMinutes.setMinutes(threshold.duration, 0, 0)
        let thresholdedAttempts = Object.keys(attempts).filter(attempt => attempt > Date.now() - diffMinutes)
        
        // Check threshold
        if (thresholdedAttempts.length >= threshold.attempts) {
            meetsThreshold = false
            thresholdDate += diffMinutes
        }
    }

    return {
        meetsThreshold: meetsThreshold,
        thresholdDate: thresholdDate
    }
}

let user = {
    history: {
        1706252844088: 'sign in attempt',
        1706252863589: 'sign in attempt',
        1706252890440: 'sign in attempt',
        1706252890445: 'sign in attempt'
    }
}
let attemptStatus = attemptsMeetThreshold(user.history)
console.log("attemptStatus", attemptStatus)
if (attemptStatus.meetsThreshold) {
    // Account for attempt
    if (user.history === undefined) {
        console.log("user.history NEW")
        user.history = {}
        user.history[Date.now()] = 'sign in attempt'
    } else {
        console.log("user.history ADD")
        user.history[Date.now()] = 'sign in attempt'
    }
} else {
    // Deny attempt
    console.log("user.history DENIED")
}
console.log("user.history", user.history)
console.log("user.history.length", Object.keys(user.history).length)