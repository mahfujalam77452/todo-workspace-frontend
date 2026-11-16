import styles from './Home.module.css';

const STEPS = [
  { title: 'Create a todo', text: 'Write the task, set a priority and a due date.' },
  { title: 'Assign a teammate', text: 'Pick someone from your team. They get a notification right away.' },
  { title: 'Accept and get it done', text: 'The assignee accepts, edits and completes it. You can follow along.' },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} aria-labelledby="how-title">
      <h2 id="how-title" className={`${styles.sectionTitle} reveal`}>How it works</h2>
      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step.title} className={`${styles.step} reveal`}>
            <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}