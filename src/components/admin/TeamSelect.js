import Select from '@/components/ui/Select';

// value is the team id as a string, or "" for no team (sent to the API as team_id: null).
export default function TeamSelect({ userId, userName, teams, value, disabled, onChange }) {
  const id = `team-${userId}`;

  return (
    <>
      <label htmlFor={id} className="visually-hidden">Team for {userName}</label>
      <Select id={id} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>
        <option value="">No team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </Select>
    </>
  );
}