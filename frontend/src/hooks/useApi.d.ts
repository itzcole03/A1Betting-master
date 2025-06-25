import { AxiosRequestConfig, AxiosError } from 'axios';
interface ApiResponse<T> {
    data: T | null;
    error: AxiosError | null;
    loading: boolean;
    request: () => Promise<void>;
}
/**
 * Custom hook for making API requests.
 * @param config AxiosRequestConfig for the request.
 * @param initialData Optional initial data.
 * @returns State object with data, error, and loading status.
 */
declare function useApi<T>(config: AxiosRequestConfig, initialData?: T | null): ApiResponse<T>;
export default useApi;
/**
 * Example Usage (conceptual):
 *
 * in YourComponent.tsx:
 * const { data: users, loading, error, request: fetchUsers } = useApi<User[]>({ url: '/users', method: 'GET' });
 *
 * useEffect(() => {
 *   fetchUsers();
 * }, [fetchUsers]);
 *
 * if (loading) return <p>Loading users...</p>;
 * if (error) return <p>Error fetching users: {error.message}</p>;
 * if (!users) return <p>No users found.</p>;
 *
 * return (
 *   <ul>
 *     {users.map(user => <li key={user.id}>{user.name}</li>)}
 *   </ul>
 * );
 */ 
