const _baseUrl = 'www.googleapis.com';
const api = 'AIzaSyBF1Eb10jmMGit1H6N5ftVcE9q5oHb1OTk';
const yt = 'https://www.googleapis.com/youtube/v3/search';

// https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=cardio%20fitness&type=video&key=AIzaSyBF1Eb10jmMGit1H6N5ftVcE9q5oHb1OTk
// https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=wweOfficial&type=video&key=AIzaSyBF1Eb10jmMGit1H6N5ftVcE9q5oHb1OTk



export const youtubeapi = async({channelId}) =>{
    // youtube api to search for videos
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&key=${api}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await res.json();
    return data
}

export const youtubevideo = async(string) =>{
    console.log(string)
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${string}fficial&type=video&key=${api}`)
    const data = await res.json();
    return data
}

export const ytplaylistapi = async({playlistId}) =>{
    
        const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${api}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await res.json();
        return data
}



// const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&key=${api}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     });
    //     const data = await res.json();
    //     return data
    // }
// const uri2 ={
//     search: `https://${_baseUrl}/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${api}`,
// }

// const uri3 ={
//     _baseUrl,
//     string,
//     parameter : {
//         part: 'snippet',
//         maxResults: '10',
//         q: '${query}',
//         type: 'video',
//         key: '${api}',

//     }
// }

// const headers ={
//     'Content-Type': 'application/json',
// }
    