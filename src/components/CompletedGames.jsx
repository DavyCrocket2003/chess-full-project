// Component to render a list of played games for a user
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'


function Completed() {

    const {userId, username, status, socketId} = useSelector((state) => state.userSession)
    const profileId = useSelector(state => state.profileId)
    const dispatch = useDispatch()
    const [gameRows, setGameRows] = useState([])
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getUTCDate()).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${month}/${day}/${year}`;
    }
    const fetchGames = async (id) => {
        console.log('fetchGames called')
        let res = await axios.get(`/games/${id}`)
        if (res.data.success) {
            console.log('sucess fetching games')
            setGameRows(res.data.games.sort(element=>element.createdAt)
                .map((element, index)=>{
                    let playedAsWhite = id===element.player1Id
                    console.log('white?', playedAsWhite, 'result', element.status)
                    return (
                        <tr key={index} className='gameRow'>
                            <td>{playedAsWhite ? (element.player2 ? element.player2.username : 'Computer') : element.player1 ? element.player1.username : 'Computer'}</td>
                            <td>{(element.status === '½-½') ? 'Draw' : ((playedAsWhite === (element.status==='1-0')) ? 'Win' : 'Loss')}</td>
                            <td>{element.moves.length}</td>
                            <td>{formatDate(element.createdAt)}</td>
                        </tr>
                )}))
        } else {
            console.log('error fetching games', res)
        }

    }

    useEffect(() => {
        fetchGames(profileId || userId)
    }, [profileId])




    return (
        <div>
            {/* <div>{gameRows.length}</div> */}
            <div className='styledContainer' id='gameListBox'>
                <h4>Completed Games</h4>
                <table className='gameListTable'>
                    <thead>
                        <tr>
                            <th>Opponent</th>
                            <th>Result</th>
                            <th>Moves</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>{gameRows}</tbody>
                </table>
            </div>
        </div>
    )
}

export default Completed
