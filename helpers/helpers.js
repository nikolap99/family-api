const formatJSON = (result) => {
    let idArr = [];
    let duplicateArr = [];
    let newResult = result
        .map((row) => {
            if (!idArr.includes(row.id)) {
                idArr.push(row.id);
                return {
                    id: row.id,
                    fullName: row.fullName,
                    email: row.email,
                    gender: row.gender,
                    kids: row.kid_id
                        ? [
                              {
                                  id: row.kid_id,
                                  name: row.name,
                                  age: row.age,
                                  gender: row.kid_gender,
                              },
                          ]
                        : [],
                };
            } else {
                const ind = result.findIndex((i) => {
                    return i.id == row.id;
                });
                duplicateArr.push({
                    i: ind,
                    kid: {
                        id: row.kid_id,
                        name: row.name,
                        age: row.age,
                        gender: row.kid_gender,
                    },
                });
            }
        })
        .filter((element) => element != null);
    duplicateArr.forEach((element) => {
        newResult[element.i].kids.push(element.kid);
    });

    return newResult;
};

module.exports = { formatJSON };
