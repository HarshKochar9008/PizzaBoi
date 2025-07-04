import React from 'react';
import styles from './FrontPage.module.scss';
import pizzaImg from '../assets/img/Landing.png';
import PizzaVec from '../assets/img/Vector.png';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/store';
import { fetchPizzas } from '../redux/pizzas/slice';
import { pizzaDataSelector } from '../redux/pizzas/selectors';
import { Status } from '../redux/pizzas/types';
import { useNavigate } from 'react-router-dom';

const features = [
    {
      icon: (
        <svg width="100" height="100" fill="none" stroke="#D7263D" strokeWidth="2" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18"/>
          <path d="M14 18l4 4 8-8" /> {/* checkmark for "tasty" */}
        </svg>
      ),
      title: 'Melty Mozzarella',
      desc: 'Stretchy, gooey, and ridiculously satisfying. Our cheese game is next-level melty.'
    },
    {
      icon: (
        <svg width="40" height="40" fill="none" stroke="#D7263D" strokeWidth="2" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18"/>
          <path d="M15 15h10v10H15z" /> {/* square tomato icon */}
        </svg>
      ),
      title: 'Saucy Tomatoes',
      desc: 'Sun-kissed tomatoes turned into the most flavorful, tangy-sweet sauce your taste buds will crave.'
    },
    {
      icon: (
        <svg width="40" height="40" fill="none" stroke="#D7263D" strokeWidth="2" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18"/>
          <path d="M12 28l4-8 4 6 6-10" /> {/* mountain-like ingredients stack */}
        </svg>
      ),
      title: 'Loaded Toppings',
      desc: 'From crunchy peppers to juicy olives and spicy pepperoni – pick your perfect combo.'
    },
    {
      icon: (
        <svg width="40" height="40" fill="none" stroke="#D7263D" strokeWidth="2" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18"/>
          <path d="M20 14c4 0 4 6 0 6s-4-6 0-6z" /> {/* oven fire shape */}
        </svg>
      ),
      title: 'Woodfire Baked',
      desc: 'Crispy on the outside, chewy on the inside. Our pies are kissed by fire and baked to perfection.'
    }
  ]
  

const FrontPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useSelector(pizzaDataSelector);
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(
      fetchPizzas({
        categoryId: '',
        sortProp: 'id',
        order: 'asc',
        search: '',
        currentPage: 1,
      })
    );
  }, [dispatch]);

  const skeletons = [...new Array(3)].map((_, index) => <Skeleton key={index} />);

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
      <div className={styles.pizzaSection}>
        <h2 className={styles.pizzaSectionTitle}>Our Popular Pizzas</h2>
        <p className={styles.pizzaSectionDesc}>Choose your favorite and add it to your cart!</p>
        <div className={styles.pizzaList}>
          {status === Status.LOADING
            ? skeletons
            : status === Status.ERROR
            ? <div style={{textAlign: 'center', width: '100%'}}>Failed to load pizzas. Please try again later.</div>
            : items.slice(0, 3).map((pizza) => (
                <div key={pizza.id} className={styles.frontPagePizzaBlock}>
                  <img className={styles.frontPagePizzaImg} src={pizza.imageUrl} alt={pizza.name} />
                  <h4 className={styles.frontPagePizzaTitle}>{pizza.name}</h4>
                  <div className={styles.frontPagePizzaDesc}>Try our delicious pizza!</div>
                </div>
              ))
          }
        </div>
        <button onClick={() => navigate('/pizzas')} className={styles.seeMoreBtn}>
          See more
        </button>
      </div>
      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <img src={PizzaVec} alt="Pizza logo" className={styles.footerLogo} />
            <div>
              <h2>PIZZABOI</h2>
              <p>Hot slices, cool vibes.</p>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <h4>Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/pizzas">Pizzas</a></li>
              <li><a href="/orders">Orders</a></li>
              <li><a href="/history">History</a></li>
            </ul>
          </div>
          <div className={styles.footerFeatures}>
            <h4>Features</h4>
            <ul>
              <li>Melty Mozzarella</li>
              <li>Saucy Tomatoes</li>
              <li>Loaded Toppings</li>
              <li>Woodfire Baked</li>
            </ul>
          </div>
          <div className={styles.footerContact}>
            <h4>Contact</h4>
            <p>Email: pizzaboi@foodie.com</p>
            <p>Phone: +91 7030649008</p>
            <p>17, PizzaBoi Near Champion Circle, FoodStreet</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          &copy; {new Date().getFullYear()} PIZZABOI. All rights reserved by HK.
        </div>
      </footer>
    </>
  );
};

export default FrontPage; 