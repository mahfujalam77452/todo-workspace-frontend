import NavLinks from './NavLinks';
import styles from './Layout.module.css';

// Visible from 768px up. On smaller screens the MobileMenu drawer is used.
export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <NavLinks />
    </aside>
  );
}