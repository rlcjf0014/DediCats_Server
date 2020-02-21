import Cat from "model/entity/Cat";

/* eslint-disable max-len */

const formatRainbow = (selectedRainbow:Cat, rainbow:{Y:number, YDate:string|null, N:number, NDate:string|null}):string => {
    const objSelectedRainbow:{Y:number, YDate:string|null, N:number, NDate:string|null} = JSON.parse(selectedRainbow.rainbow);
    if (rainbow.YDate) {
        objSelectedRainbow.Y += rainbow.Y;
        objSelectedRainbow.YDate = rainbow.YDate;
    } else {
        objSelectedRainbow.N += rainbow.N;
        objSelectedRainbow.NDate = rainbow.NDate;
    }

    return JSON.stringify(objSelectedRainbow);
};

const formatCut = (selectedCut:Cat, catCut:{Y:number, N:number, unknown:number}):string => {
    const objSelectedCut:{Y:number, N:number, unknown:number} = JSON.parse(selectedCut.cut);
    objSelectedCut.Y += catCut.Y;
    objSelectedCut.N += catCut.N;
    objSelectedCut.unknown += catCut.unknown;

    return JSON.stringify(objSelectedCut);
};


export {formatRainbow, formatCut};
