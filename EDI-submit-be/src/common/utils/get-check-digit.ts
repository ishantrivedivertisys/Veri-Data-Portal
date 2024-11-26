export function getCheckDigit(id: number): number {
    const results: number[] = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
    const digits: number[] = id.toString().split('').map(d => parseInt(d, 10));
    let i: number = 0;
    const lengthMod: number = digits.length % 2;
    const sum: number = digits.reduce((acc, d) => {
        return acc + (i++ % 2 === lengthMod ? d : results[d]);
    }, 0) * 9 % 10;
    return parseInt(`${id}${sum}`);
}