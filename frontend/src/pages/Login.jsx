
function Login() {
    return (
        <div>
            <h1>Welcome to the Tournament Management System</h1>
            <div>
            <h1>Login</h1>
            <form action="/login" method="POST">
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
        </div>
    );
}
export default Login;