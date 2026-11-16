import Select from '@/components/ui/Select';
import styles from './Todos.module.css';

// Only members of the user's own team can be picked (plus "Myself").
// Props:
//   members  = array of team members, or null if loading them failed
//   team     = the current user's team, or null
//   allowUnassigned = show "Not assigned yet" (create form). The assign panel sets it to false.
export default function AssignPicker({
  id,
  value,
  onChange,
  members,
  team,
  currentUser,
  allowUnassigned = true,
  error,
  disabled,
}) {
  if (!team) {
    return (
      <p className={styles.notice} role="status">
        You are not in a team, contact an admin. Until then you cannot assign todos.
      </p>
    );
  }

  const teammates = (members ?? []).filter((member) => member.id !== currentUser.id);

  return (
    <>
      <Select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
        disabled={disabled}
      >
        {allowUnassigned ? (
          <option value="">Not assigned yet</option>
        ) : (
          <option value="" disabled>Choose a person</option>
        )}
        <option value={currentUser.id}>Myself</option>
        {teammates.map((member) => (
          <option key={member.id} value={member.id}>{member.name}</option>
        ))}
      </Select>
      {members === null && (
        <p className={styles.meta}>Could not load your teammates. You can still pick Myself.</p>
      )}
    </>
  );
}