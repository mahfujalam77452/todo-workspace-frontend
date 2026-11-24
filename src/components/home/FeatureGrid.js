import styles from './Home.module.css';

const FEATURES = [
  { title: 'Roles', text: 'Members do the work. Project Managers follow their team. Admins manage users, roles and team membership.' },
  { title: 'Assign to teammates', text: 'Give a todo to someone on your team. People outside your team cannot be assigned.' },
  { title: 'Accept or reject', text: 'The assignee decides. A rejection can come with a short reason.' },
  { title: 'Notifications', text: 'You are told when a todo is assigned to you, and when your assignment is accepted or rejected.' },
  { title: 'Teams', text: 'Work is organised by team, so assignments always stay inside the group that owns them.' },
  { title: 'Roles', text: 'Members do the work. Admins manage users, roles and team membership.' },
];

export default function FeatureGrid() {
  return (
    <section className={styles.section} aria-labelledby="features-title">
      <h2 id="features-title" className={`${styles.sectionTitle} reveal`}>What you can do</h2>
      <ul className={styles.featureGrid}>
        {FEATURES.map((feature) => (
          <li key={feature.title} className={`${styles.feature} reveal`}>
            {/* TODO: add feature icon here */}
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}