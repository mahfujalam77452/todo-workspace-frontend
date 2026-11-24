import Select from '@/components/ui/Select';
import styles from './Admin.module.css';

// disabled = the admin's own row. The backend also blocks changing your own role.
export default function RoleSelect({ userId, userName, value, disabled, onChange }) {
  const id = `role-${userId}`;

  return (
    <>
      <label htmlFor={id} className="visually-hidden">Role for {userName}</label>
      <Select
        id={id}
        value={value}
        disabled={disabled}
        aria-describedby={disabled ? `${id}-note` : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
         <option value="member">Member</option>
         <option value="pm">Project Manager</option>
         <option value="admin">Admin</option>
      </Select>
      {disabled && (
        <span id={`${id}-note`} className={styles.hint}>You cannot change your own role.</span>
      )}
    </>
  );
}