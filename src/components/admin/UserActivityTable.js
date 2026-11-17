import Link from 'next/link';
import RatioBar from './RatioBar';
import adminStyles from './Admin.module.css';

export default function UserActivityTable({ users }) {
  return (
    <table className={adminStyles.table}>
      <caption className="visually-hidden">User activity</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Team</th>
          <th scope="col">Assigned</th>
          <th scope="col">Completed</th>
          <th scope="col">Rejected</th>
          <th scope="col">Completion</th>
          <th scope="col">Rejection</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td data-label="Name">
              <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
            </td>
            <td data-label="Team">{user.team ? user.team.name : 'No team'}</td>
            <td data-label="Assigned">{user.assigned_count}</td>
            <td data-label="Completed">{user.completed_count}</td>
            <td data-label="Rejected">{user.rejected_count}</td>
            <td data-label="Completion"><RatioBar value={user.completion_rate} /></td>
            <td data-label="Rejection"><RatioBar value={user.rejection_rate} danger /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}