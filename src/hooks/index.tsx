import moment from 'moment';
import cheerio from "cheerio";
import NepaliDateConverter from 'nepali-date-converter';
import NepaliDate from 'nepali-date-converter';

export const removeHTMLTags = (html) => {
    const $ = cheerio.load(html);
    return $.text();
}

export const arabicToDevanagari = (number: number): string => {
    const arabicDigits: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const devanagariDigits: string[] = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

    const arabicNumberString: string = number.toString();
    let devanagariNumberString: string = '';

    for (let i = 0; i < arabicNumberString.length; i++) {
        const digit: string = arabicNumberString.charAt(i);
        const index: number = arabicDigits.indexOf(digit);
        if (index !== -1) {
            devanagariNumberString += devanagariDigits[index];
        } else {
            devanagariNumberString += digit;
        }
    }

    return devanagariNumberString;
}

export const nepaliToEnglish = (number: string): string => {
    const englishDigits: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const nepaliDigits: string[] = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

    let englishNumberString: string = '';

    for (let i = 0; i < number.length; i++) {
        const digit: string = number.charAt(i);
        const index: number = nepaliDigits.indexOf(digit);
        if (index !== -1) {
            englishNumberString += englishDigits[index];
        } else {
            englishNumberString += digit;
        }
    }

    return englishNumberString;
}


export const getRemainingDays = (selectedDateString: string): number => {
    if (!selectedDateString) return 0; // Add a check for undefined or null

    // Get the current date using Moment.js and set it to the start of the day in local time zone
    const currentDate: moment.Moment = moment().startOf('day');

    // Parse the selectedDateString using Moment.js and set it to the start of the day in local time zone
    const selectedDate: moment.Moment = moment(selectedDateString).startOf('day');

    // Calculate the difference in days
    const remainingDays: number = selectedDate.diff(currentDate, 'days');

    return remainingDays;
}


export const nepaliDaysRemaining = (remainingDays: number): JSX.Element | null => {
    if (remainingDays === -1) {
        return (
            <>हिजो</>
        );
    } else if (remainingDays === 0) {
        return (
            <>आज</>
        );
    } else if (remainingDays === 1) {
        return (
            <>भोलि</>
        );
    } else if (remainingDays > 0 && remainingDays !== 1) {
        if (remainingDays > 365) {
            const yearsLeft = Math.floor(remainingDays / 365);
            const remainingDaysAfterYears = remainingDays % 365;
            if (remainingDaysAfterYears > 30) {
                const monthsLeft = Math.floor(remainingDaysAfterYears / 30);
                return (
                    <>
                        {arabicToDevanagari(yearsLeft)}{" "}
                        वर्ष {" "}
                        {arabicToDevanagari(monthsLeft)}{" "}
                        महिना बाँकी
                    </>
                );
            } else {
                return (
                    <>
                        {arabicToDevanagari(yearsLeft)}{" "}
                        वर्ष {" "}
                        {arabicToDevanagari(remainingDaysAfterYears)}{" "}
                        दिन बाँकी
                    </>
                );
            }
        } else if (remainingDays > 30) {
            const monthsLeft = Math.floor(remainingDays / 30);
            return (
                <>
                    {arabicToDevanagari(monthsLeft)}{" "}
                    महिना बाँकी
                </>
            );
        } else {
            return (
                <>
                    {arabicToDevanagari(remainingDays)}{" "}
                    दिन बाँकी
                </>
            );
        }
    } else if (remainingDays < 0) { // Handling past dates
        if (Math.abs(remainingDays) > 365) {
            const yearsAgo = Math.floor(Math.abs(remainingDays) / 365);
            const remainingDaysAfterYears = Math.abs(remainingDays) % 365;
            if (remainingDaysAfterYears > 30) {
                const monthsAgo = Math.floor(remainingDaysAfterYears / 30);
                return (
                    <>
                        {arabicToDevanagari(yearsAgo)}{" "}
                        वर्ष पहिले {" "}
                        {arabicToDevanagari(monthsAgo)}{" "}
                        महिना पहिले
                    </>
                );
            } else {
                return (
                    <>
                        {arabicToDevanagari(yearsAgo)}{" "}
                        वर्ष पहिले {" "}
                        {arabicToDevanagari(remainingDaysAfterYears)}{" "}
                        दिन पहिले
                    </>
                );
            }
        } else if (Math.abs(remainingDays) > 30) {
            const monthsAgo = Math.floor(Math.abs(remainingDays) / 30);
            return (
                <>
                    {arabicToDevanagari(monthsAgo)}{" "}
                    महिना पहिले
                </>
            );
        } else {
            return (
                <>
                    {arabicToDevanagari(Math.abs(remainingDays))}{" "}
                    दिन पहिले
                </>
            );
        }
    } else {
        return null;
    }
};



export const englishDaysRemaining = (remainingDays: number): JSX.Element | null => {
    if (remainingDays === -1) {
        return (
            <>Yesterday</>
        );
    } else if (remainingDays === 0) {
        return (
            <>Today</>
        );
    } else if (remainingDays === 1) {
        return (
            <>Tomorrow</>
        );
    } else if (remainingDays > 0 && remainingDays !== 1) {
        if (remainingDays > 365) {
            const yearsLeft = Math.floor(remainingDays / 365);
            const remainingDaysAfterYears = remainingDays % 365;
            if (remainingDaysAfterYears > 30) {
                const monthsLeft = Math.floor(remainingDaysAfterYears / 30);
                return (
                    <>
                        {yearsLeft}{" "}
                        year {" "}
                        {monthsLeft}{" "}
                        month left
                    </>
                );
            } else {
                return (
                    <>
                        {yearsLeft}{" "}
                        year {" "}
                        {remainingDaysAfterYears}{" "}
                        day left
                    </>
                );
            }
        } else if (remainingDays > 30) {
            const monthsLeft = Math.floor(remainingDays / 30);
            return (
                <>
                    {monthsLeft}{" "}
                    month left
                </>
            );
        } else {
            return (
                <>
                    {remainingDays}{" "}
                    days remaining
                </>
            );
        }
    } else if (remainingDays < 0) { // Handling past dates
        if (Math.abs(remainingDays) > 365) {
            const yearsAgo = Math.floor(Math.abs(remainingDays) / 365);
            const remainingDaysAfterYears = Math.abs(remainingDays) % 365;
            if (remainingDaysAfterYears > 30) {
                const monthsAgo = Math.floor(remainingDaysAfterYears / 30);
                return (
                    <>
                        {yearsAgo}{" "}
                        year ago {" "}
                        {monthsAgo}{" "}
                        month ago
                    </>
                );
            } else {
                return (
                    <>
                        {yearsAgo}{" "}
                        year ago {" "}
                        {remainingDaysAfterYears}{" "}
                        day ago
                    </>
                );
            }
        } else if (Math.abs(remainingDays) > 30) {
            const monthsAgo = Math.floor(Math.abs(remainingDays) / 30);
            return (
                <>
                    {monthsAgo}{" "}
                    month ago
                </>
            );
        } else {
            return (
                <>
                    {Math.abs(remainingDays)}{" "}
                    days ago
                </>
            );
        }
    } else {
        return null;
    }
};

export const timeAgo = (timestamp: string): any => {
    const currentTime = Date.now();
    const createdAtTime = new Date(timestamp).getTime();
    const timeDifference = currentTime - createdAtTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return (
            <span>
                भर्खरै
            </span>
        );
    } else if (minutes < 60) {
        return (
            <>
                {arabicToDevanagari(minutes)}
                <br />
                मिनेट
            </>
        );
    } else if (hours < 24) {
        return (
            <>
                {arabicToDevanagari(hours)}
                <br />
                घण्टा
            </>
        );

    } else if (days === 1) {
        return (
            <>
                १
                <br />
                दिन
            </>
        );
    } else {
        return (
            <>
                {arabicToDevanagari(days)}
                <br />
                दिन
            </>
        );
    }
}

export const yearList = (): number[] => {
    // Generate an array of years from 2000 to 3000
    const years: number[] = [];
    for (let year = 2031; year <= 2200; year++) {
        years.push(year);
    }
    return years;
};
export const limitedYearList = (): number[] => {
    const currentNepaliDate = new NepaliDate();
    const currentYear = currentNepaliDate.getYear();
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;
    const years: number[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    
    return years;
};
export const englishYearList = (): number[] => {
    // Generate an array of years from 2000 to 3000
    const years: number[] = [];
    for (let year = 1977; year <= 2143; year++) {
        years.push(year);
    }
    return years;
};
export const limitedEngYearList = (): number[] => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;
    const endYear = currentYear + 10;
    const years: number[] = [];
    
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    
    return years;
};

export const monthNames = [
    "बैशाख",
    "जेठ",
    "असार",
    "साउन",
    "भदौ",
    "असोज",
    "कार्तिक",
    "मंसिर",
    "पौष",
    "माघ",
    "फागुन",
    "चैत",
]
export const dayNames = [
    "आइतबार",
    "सोमबार",
    "मङ्गलबार",
    "बुधबार",
    "बिहिबार",
    "शुक्रबार",
    "शनिबार"
]

export const formattedNepDate = (data: string): any => {
    // Define the Gregorian date string
    const gregorianDateStr = data;

    // Split the date string into day, month, and year
    const [day, month, year] = gregorianDateStr.split('.').map(Number);

    // Convert the month and day to Nepali numerals
    const nepaliMonths = ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'आश्विन', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'];
    const nepaliMonthName = nepaliMonths[month - 1];

    // Format the Nepali date
    const formattedNepaliDate = `${nepaliMonthName} ${arabicToDevanagari(day)}, ${arabicToDevanagari(year)}`;

    return formattedNepaliDate
}

export const formattedEngDate = (data: string): any => {
    // Define the Gregorian date string
    const gregorianDateStr = data;

    // Split the date string into day, month, and year
    const [year, month, day] = gregorianDateStr.split('-').map(Number);

    // Convert the month and day to Nepali numerals
    const nepaliMonths = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const nepaliMonthName = nepaliMonths[month - 1];

    // Format the Nepali date
    const formattedEngDate = `${day} ${nepaliMonthName}, ${year}`;

    return formattedEngDate
}