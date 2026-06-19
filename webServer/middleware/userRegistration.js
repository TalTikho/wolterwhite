const unique_chars = ['@', '!', '#', '$', '%', '^', '&', '*'];

//Validation dictionary
const validationRules = {
    username: {
        required: {
            expect: true,
            message: "You must choose a username\n"
        }, minLength: {
            expect: 4,
            message: "username must be at least 4 characters long\n"
        },
        numbers_and_letters: {
            //regex for all letters and digits.
            expect: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
            message: "username must have numbers and letters\n"
        },
    },
    displayName: {
        required: {
            expect: true,
            message: "You must choose a displayName\n"
        }, minLength: {
            expect: 4,
            message: "displayName must be at least 4 characters long\n"
        }
    },
    phone: {
        required: {
            expect: true,
            message: "You must enter a phone number\n"
        },
        pattern: {
            //regex for a specific (the one specified in the message) phone number.
            expect: /^\d{3}-\d{3}-\d{4}$/,
            message: "Enter a phone number in the XXX-XXX-XXXX format where X is an integer\n"
        }
    },
    address: {
        required: {
            expect: true,
            message: "You must enter an address\n"
        }
    },
    password: {
        required: {
            expect: true,
            message: "You must enter a password\n"
        },
        minLength: {
            expect: 8,
            message: "password must be at least 8 characters long\n"
        },
        numbers_and_letters: {
            expect: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
            message: "password must have numbers and letters\n"
        },
        unique_chars: {
            //If password contains at least one unique character it is ok.
            //unique is what is in the list in the top of the file.
            expect: (text) => ['@', '!', '#', '$', '%', '^', '&', '*'].some(char => text.includes(char)),
            message: "password must have at least one unique_char\n"
        },
        upper_lower: {
            //IF the text is different than its conversions to lower and upper it
            //means at least one letter is different cased than the others.
            expect: (text) => text.toLowerCase() !== text && text.toUpperCase() !== text,
            message: "password must have at least one upper and one lower case char\n"
        },
    },
    profilePic: {
        required: {
            expect: true,
            message: "You must have a profilePic\n"
        },
        must_upload_picture: {
            //A picture has a name.
            expect: (text) => text.trim() !== "",
            message: "profilePic must exist.\n"
        },
    }
}


export const userDataRegistration = (req, res, next) => {
    const userData = req.body;
    const errors = [];
    var missing = false;
    let profilePic = "";
    if (req.file) {
        // Build the relative path 
        profilePic = req.file.filename;
    }
    userData.profilePic = profilePic;
    for (const field in validationRules) {

        //Open the object to get the actual field's object holding the rules
        const rules = validationRules[field];

        //if the field is empty in the request userData[field] is undefined.
        const userInput = userData[field] || "";

        //Check if the field is empty or null in the request body
        //do not run the rest of the loop and add the error if neccessary.
        if (userInput.trim() === "") {
            if (rules.required && rules.required.expect === true) {
                errors.push(rules.required.message);
                if (!missing) {
                    missing = true;
                    errors.push("Missing required fields\n");
                }
            }
            continue;
        }

        //loop through the rules inside that specific field
        for (const expectation in rules) {

            //Now grab the expect value and the message
            const expectedValue = rules[expectation].expect;
            const errorMessage = rules[expectation].message;
            switch (typeof (expectedValue)) {
                case "number":
                    if (userInput.length < expectedValue) {
                        errors.push(errorMessage);
                    }
                    break;
                case "function":
                    if (!expectedValue(userInput)) {
                        errors.push(errorMessage);
                    }
                    break;
                case "object":
                    if (expectedValue instanceof RegExp) {
                        if (!(expectedValue.test(userInput))) {
                            errors.push(errorMessage);
                        }

                    }
                    break;
                default:
                    console.log("ok");
            }
        }
    }
    //if we caught any errors we return them along with the error status.
    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    next()
}



