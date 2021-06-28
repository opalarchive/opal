const identity =
  (O: React.FC<{ v: number }>) =>
  ({ v }) => {
    return <O v={v} />;
  };

const Test: React.FC<{ v: number }> = identity(({ v }) => {
  console.log(v);
  return <div>Test: {v}</div>;
});

export const getServerSideProps = () => {
  return { props: { v: 3 } };
};

export default Test;
