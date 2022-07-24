import { Container, Text ,Loading ,Grid, Pagination } from '@nextui-org/react'
import { useEffect , useState } from 'react'
import {excercisedbapi} from '../services/exerciseapi'
import { CardExercise } from './Card'

const Exercise = ({bodypart}) => {
    
    const [body, setBody] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [exercisesPerPage] = useState(6);

    useEffect(() => {
        window.scrollTo({ top: 1800, behavior: 'smooth' });
        const fetchExerciseData = async () => {
            let exercisesData = [];
            
            if(!bodypart){

                const string = `bodyPart/back`
                exercisesData  = await excercisedbapi({string})

            }else{
                const string = `bodyPart/${bodypart}`
                exercisesData  = await excercisedbapi({string})
            }
           setBody(exercisesData);
        };

        fetchExerciseData();
        
    }, [bodypart])

    const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = body.slice(indexOfFirstExercise, indexOfLastExercise);

    const paginate = (value) => {
        setCurrentPage(value);
        console.log(value)
    
        window.scrollTo({ top: 1800, behavior: 'smooth' });
      };
    
    if (!currentExercises.length) return <Loading size={'xl'} type="points" />;
    console.log(body[0].gifUrl)
  return (
    <Container>
        <Text h3 css={{textAlign:'center',marginTop:'20px'}} >Exercise</Text> 
        <h1> {bodypart} part</h1>
        <Grid.Container gap={2} justify="center">
        {currentExercises.map((exercise, idx) => (
          
          // <h1>exercise</h1>
          <Grid xs={12} sm={4}>
           
            <CardExercise exercise={exercise} />
          </Grid>
        ))} 
        </Grid.Container>
        <div style={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
        }}>
        {body.length > 9 && (
          <Pagination
            color='success'
            shadow
            onChange={ paginate }
            total={Math.ceil(body.length / exercisesPerPage)}
            page={currentPage} 
            css={{marginTop:'20px',}} 
          />
        )}
                
        </div>
    </Container>
  )
}

export default Exercise
