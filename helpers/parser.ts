export const get8BitArrayBinaryFrom = (number: number, bytes: number) => {
    let binary = new Uint8Array(bytes);
    const binarystring = number.toString(2).padStart(bytes * 8, '0')

    for(let i = 0; i < bytes * 8; i += 8){
        binary[i / 8] = parseInt(binarystring.slice(i, i + 8), 2);
    }

    return binary;
}