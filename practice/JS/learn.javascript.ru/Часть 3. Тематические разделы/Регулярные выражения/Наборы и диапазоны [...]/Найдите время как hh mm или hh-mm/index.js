/**Найдите время как hh:mm или hh-mm
Время может быть в формате часы:минуты или часы-минуты. И часы, и минуты имеют две цифры: 09:00 или 21-30.

Напишите регулярное выражение, чтобы найти время:

let reg = /your regexp/g;
alert( "Завтрак в 09:00. Ужин в 21-30".match(reg) ); // 09:00, 21-30
P.S. В этой задаче мы предполагаем, что время всегда правильное, нет необходимости отфильтровывать плохие строки, такие как «45:67». Позже мы разберёмся с этим. */

let reg = /\d{2}[:-]\d{2}/g;
console.log( "Завтрак в 09:00. Ужин в 21-30".match(reg) ); // 09:00, 21-30
