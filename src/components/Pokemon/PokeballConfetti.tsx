import Confetti from 'react-confetti';

export default () => {
  return (
    <>
      <Confetti
        recycle={false}
        tweenDuration={10000}
        drawShape={(context) => {
          context.lineWidth = 2.5;
          //set white as the fill color
          context.fillStyle = 'white';

          //draw arc from 0 to 1*PI
          context.beginPath();
          context.arc(100, 100, 30, 0, 1 * Math.PI);
          context.closePath();

          //stroke outline with default black
          context.stroke();
          //fill with white
          context.fill();

          //set red as the fill color
          context.fillStyle = 'rgb(150,0,0)';

          //draw arc from 1*PI to 0
          context.beginPath();
          context.arc(100, 100, 30, 1 * Math.PI, 0);
          context.closePath();

          //stroke outline with default black
          context.stroke();
          //fill with red
          context.fill();

          context.beginPath();
          context.arc(100, 100, 10, 0, 2 * Math.PI);
          context.fillStyle = 'white';
          context.closePath();

          context.stroke();
          context.fill();

          context.beginPath();
          context.arc(100, 100, 9, 0, 2 * Math.PI);
          context.fillStyle = 'rgba(24,23,24, .8)';
          context.closePath();
          context.stroke();
        }}
      />
    </>
  );
};
