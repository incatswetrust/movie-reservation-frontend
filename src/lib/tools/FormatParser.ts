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

    static formatMinutesToHours(minutes: number|undefined): string {
        if(minutes === undefined){
          return "";
        }
      if (minutes < 60) {
        return `${minutes}m`;
      } else {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
      }
    };

    static shortNameFormat(original: string|undefined|null): string{
        return original?.slice(0, 20)+`${(original?.length!==undefined && original?.length>=20 ? '...':'')}`
    }
}