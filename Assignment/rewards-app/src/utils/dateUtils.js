 //Generates a stable month-year key and display label

export function getMonthYearKey(isoDate){
    const date = new Date(isoDate);
    // Numerical year and month (month is zero-based in JS Date)
    const year = date.getFullYear();
    const month = date.getMonth()+1;
    //Stable key used for aggregation and lookups
    const key = `${year}-${String(month).padStart(2,'0')}`;

    //Human-readable label used directly in UI
    const label = new Intl.DateTimeFormat('en-Us',{
        month:'short',
        year:'numeric',
    }).format(date);

    return {key,year,month,label};
}