import styles from "./NotFound.module.scss";

const NotFoundBlock: React.FC = () => {
  return (
    <>
      <h1 className={styles.root}>Nothing found 😕</h1>
    </>
  );
};

export const ComingSoon: React.FC = () => {
  return (
    <>
      <h1 className={styles.root}>Coming Soon 🔥</h1>
    </>
  );
};

export default NotFoundBlock;
