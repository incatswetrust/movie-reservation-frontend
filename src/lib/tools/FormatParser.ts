export class FormatParser{
    static formatDateTime(dateTimeString: string|undefined|null):string {
        if (dateTimeString === undefined || dateTimeString === null){
          return "";
        }
            const options:Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        };
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', options);
    };
}