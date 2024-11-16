

export async function apiRegister(sid,pass,gen,fn,ln){
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    const response = await fetch("http://localhost:8800/students", {
    method: "POST",
    // 
    body: JSON.stringify({ studentID: sid,
        password: pass,
        gender: gen,
        firstName: fn,
        lastName: ln
    }),
    headers: myHeaders,
});
}

export function canJoinGender(leagueGen, stuGen){
    switch(leagueGen){
        case "Male":
            return stuGen == "M";
        case "Female":
            return stuGen == "M";
    }
    return true;
}

export async function getStudentTeams(sid){
    const url = `http://localhost:8800/teams/student/${sid}`
    try {
        const response = await fetch(url);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
       return json;
    } catch (error) {
        console.error(error.message);
    }
}

// export async function findLogIn(sid, password)
