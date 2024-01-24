
export function formatDateToDayMonthYear(dateString: string): string {
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string. Unable to parse the date.');
    }
  
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  