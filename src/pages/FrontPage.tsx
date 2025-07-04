import React from 'react';
import styles from './FrontPage.module.scss';
import pizzaImg from '../assets/img/Landing.png';
import PizzaBlock from '../components/PizzaBlock';

const features = [
  {
    icon: (
      <svg width="100" height="100" fill="none" stroke="#D7263D" strokeWidth="2" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18"/><path d="M20 10v10l7 7"/></svg>
    ),
    title: 'Italian Oil',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas nisi nec libero fermentum.'
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" stroke="#D7263D" strokeWidth="2" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18"/><path d="M25 15a5 5 0 1 1-10 0"/></svg>
    ),
    title: 'Tomatoes',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas nisi nec libero fermentum.'
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" stroke="#D7263D" strokeWidth="2" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18"/><path d="M15 25l10-10"/></svg>
    ),
    title: 'Fresh Ingredients',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas nisi nec libero fermentum.'
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" stroke="#D7263D" strokeWidth="2" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18"/><path d="M20 25v-10"/></svg>
    ),
    title: 'Top Chefs',
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer egestas nisi nec libero fermentum.'
  },
];

const samplePizzas = [
  {
    id: '1',
    name: 'Margherita',
    price: 10,
    imageUrl: '/img/card/01.jpg',
    sizes: [26, 30, 40],
    types: [0, 1],
    rating: 4,
  },
  {
    id: '2',
    name: 'Pepperoni',
    price: 12,
    imageUrl: '/img/card/02.jpg',
    sizes: [26, 30, 40],
    types: [0, 1],
    rating: 5,
  },
  {
    id: '3',
    name: 'Veggie',
    price: 11,
    imageUrl: '/img/card/03.jpg',
    sizes: [26, 30, 40],
    types: [0, 1],
    rating: 4,
  },
];

const FrontPage: React.FC = () => {
  return (
    <>
      <div className={styles.heroSection}>
        <div className={styles.heroLeft}>
          <img src={pizzaImg} alt="Pizza with floating ingredients" className={styles.bigHeroPizzaImg} />
        </div>
        <div className={styles.heroRight}>
          <h1 className={styles.title}>FEED THE BEAST WITH<br/>A PIZZA FEAST</h1>
          <div className={styles.features}>
            {features.map((f, i) => (
              <div className={styles.feature} key={i}>
                <div className={styles.icon}>{f.icon}</div>
                <div>
                  <div className={styles.featureTitle}>{f.title}</div>
                  <div className={styles.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Pizza List Section with white background */}
      <div className={styles.pizzaSection}>
        <h2 className={styles.pizzaSectionTitle}>Our Popular Pizzas</h2>
        <p className={styles.pizzaSectionDesc}>Choose your favorite and add it to your cart!</p>
        <div className={styles.pizzaList}>
          {samplePizzas.map((pizza) => (
            <PizzaBlock key={pizza.id} {...pizza} />
          ))}
        </div>
      </div>
    </>
  );
};

export default FrontPage; 