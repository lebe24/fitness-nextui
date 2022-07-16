const  exercisedb = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'cec48a5f2dmsh0f7bcb2b444520cp1a4072jsn1e9ebc6dd367',
		'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
	}
};

const exercisequote = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '23724cec06msh87881299a984296p1d1ef2jsn577eca766cea',
		'X-RapidAPI-Host': 'bodybuilding-quotes1.p.rapidapi.com'
	}
};

const exercisedburl = 'https://exercisedb.p.rapidapi.com/exercises/';
const exercisequoteurl = 'https://bodybuilding-quotes1.p.rapidapi.com/';

export const excercisedbapi = async({string}) => {
    const res = await fetch(exercisedburl + `${string}`, exercisedb);
    const data = await res.json();
    return data
}

export const exercisequoteapi = async({string}) => {
    const res = await fetch(exercisequoteurl + `${string}`, exercisequote);
    const data = await res.json();
    return data
}