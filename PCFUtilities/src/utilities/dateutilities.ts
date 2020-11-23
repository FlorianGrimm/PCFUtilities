function getConsts(): {
    ticksPerDay: number,
    ticksPerWeek: number
} {
    const ticksMonday = (new Date("2000-01-03")).getTime();
    const ticksTuesDay = (new Date("2000-01-04")).getTime();
    const ticksMonday2 = (new Date("2000-01-10")).getTime();
    (new Date("2000-01-10")).getDay
    const ticksPerDay = (ticksTuesDay - ticksMonday) | 0;
    const ticksPerWeek = (ticksMonday2 - ticksMonday) | 0;
    return {
        ticksPerDay,
        ticksPerWeek
    };
}
export const {
    ticksPerDay,
    ticksPerWeek
} = getConsts();

/**
 * day Sunday - Saturday : 0 - 6
 */
export function getWeekStartDate(date:Date,day:number):Date{
    const dateDay = date.getDay();
    if (dateDay < day){
        return new Date(date.getTime() + ((day - dateDay - 7) * ticksPerDay));
    } else {
        return new Date(date.getTime() + ((day - dateDay) * ticksPerDay));
    }
}
export function getNextWeekStartDate(date:Date,day:number):Date{
    const dateDay = date.getDay();
    if (dateDay < day){
        return new Date(date.getTime() + ((day - dateDay) * ticksPerDay));
    } else {
        return new Date(date.getTime() + ((day - dateDay + 7) * ticksPerDay));
    }
}