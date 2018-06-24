module.exports = {

    CreateMultiDArray: (iRows, iCols, defaultVal, bAppendLocation) => {
        let aBuf = [];
        let value = '';

        for (let i = 0; i < iRows; i++) {
            let aRow = [];
            for (let j = 0; j < iCols; j++) {
                value = "" + defaultVal;
                if (bAppendLocation) {
                    value = value + '-' + i + '-' + j;
                }
                aRow.push(value);
            }
            aBuf.push(aRow);
        }

        return aBuf;
    }

}