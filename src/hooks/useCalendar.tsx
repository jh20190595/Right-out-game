
export default function useCalendar() {
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year,month,1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const dayArray = [
        ...Array(firstDay).fill(null),
        ...Array.from({length : lastDate}, (_,i) => i + 1)
    ]

    return { year, month , firstDay, lastDate,dayArray}

}