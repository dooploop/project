import numpy as np
from scipy.integrate import quad
import matplotlib.pyplot as plt

# Добавим вывод значений в функции p(x), q(x) и f(x)

def p(x):
    result = 95 * np.exp(140/95)
    print(f'p({x}) = {result}')
    return result

def q(x):
    return 14 * np.sin(float(95**14)) + 2 * 95


def f(x):
    result = 1
    print(f'f({x}) = {result}')
    return result


def basis_function(x, i, a, b, N):
    h = (b - a) / N
    xi = a + i * h
    xi_plus_1 = a + (i + 1) * h
    if i == 0:
        return lambda x: (xi_plus_1 - x) / h
    elif i == N:
        return lambda x: (x - xi) / h
    else:
        return lambda x: (x - xi) / h if xi <= x < xi_plus_1 else 0

def generate_FEM_system(a, b, N):
    num_nodes = N + 1
    nodes = np.linspace(a, b, num_nodes)
    K = np.zeros((num_nodes, num_nodes))
    F = np.zeros(num_nodes)

    for i in range(N):
        for j in range(N):
            basis_i = basis_function(nodes, i, a, b, N)
            basis_j = basis_function(nodes, j, a, b, N)
            integrand = lambda x: p(x) * basis_i(x) * basis_j(x)
            result, _ = quad(integrand, a, b)
            K[i, j] = result

        integrand = lambda x: f(x) * basis_i(x)
        result, _ = quad(integrand, a, b)
        F[i] = result

    K[0, 0] = 1
    K[N, N] = 1
    F[0] = 0
    F[N] = 0
   
    return K, F

# Jacobi method (as previously defined)
def solve_jacobi(K, F, epsilon=1e-10):
    num_nodes = K.shape[0]
    U = np.zeros(num_nodes)
    U_new = np.copy(U)

    max_iterations = 10000
    for iteration in range(max_iterations):
        for i in range(num_nodes):
            U_new[i] = (F[i] - np.dot(K[i, :i], U[:i]) - np.dot(K[i, i+1:], U[i+1:])) / K[i, i]
        
        if np.linalg.norm(U_new - U) < epsilon:
            break

        U = U_new
   # print(U)
    return U

def solve_system(K, F):
    num_nodes = K.shape[0]
    U = np.zeros(num_nodes)

    max_iterations = 10000
    epsilon = 1e-10
    for iteration in range(max_iterations):
        U_new = np.copy(U)
        for i in range(num_nodes):
            sum1 = np.dot(K[i, :i], U[:i])
            sum2 = np.dot(K[i, i+1:], U[i+1:])
            U_new[i] = (F[i] - sum1 - sum2) / K[i, i]

        if np.linalg.norm(U_new - U) < epsilon:
            break

        U = U_new

    return U

def calculate_error(a, b, N, h, method):
    if method == 'FEM':
        K, F = generate_FEM_system(a, b, N)
        U_h = solve_system(K, F)
    elif method == 'Jacobi':
        K, F = generate_FEM_system(a, b, N)
        U_h = solve_jacobi(K, F)
    
    print(K)
    x = np.linspace(a, b, N + 1)
    U_exact = x * (b - x)

    error_norm = np.linalg.norm(U_exact - U_h)
    return np.sqrt(h) * error_norm

# Define the interval [a, b]
a = np.pi*24
b = a + 95/50 +2 

# Initialize lists to store results
hs = []
errors = []

# Range of h values
h_values = range(10, 1010, 10)

for h in h_values:
    N = int((b - a) / h)
    K, F = generate_FEM_system(a, b, N)
    U = solve_jacobi(K, F)  # Now we use Jacobi method
    error = calculate_error(a, b, N, h, method='Jacobi')  # Use 'Jacobi' here
    hs.append(h)
    errors.append(error)

# Filter out errors smaller than a threshold for better visualization
threshold = 1e-4
hs = [h for h, error in zip(hs, errors) if error > threshold]
errors = [error for error in errors if error > threshold]

# Plot the error in a logarithmic scale
# Plot the error
plt.plot(hs, errors)
plt.xlabel('h')
plt.ylabel('Error')
plt.title('Convergence of Jacobi Method')
plt.grid(True)
plt.show()

