.admin-page-container {
    padding: 50px 40px;
    background-color: var(--bg-color);
    color: var(--text-color);
    min-height: 100vh;
    box-sizing: border-box;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.admin-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 20px;
}

.admin-page-title {
    font-size: 2.2rem;
    font-weight: 800;
    color: var(--text-color);
    margin: 0;
}

.admin-primary-action-btn {
    padding: 12px 28px;
    font-size: 1rem;
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    background-color: var(--button-border);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.1s ease, background-color 0.2s ease;
}

.admin-primary-action-btn:hover {
    background-color: color-mix(in srgb, black 15%, var(--button-border));
    transform: translateY(-2px);
}

.admin-back-btn {
    background-color: transparent;
    color: var(--text-color);
    border: 1px solid var(--button-border);
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 24px;
    transition: background-color 0.2s ease;
}

.admin-back-btn:hover {
    background-color: color-mix(in srgb, var(--button-border) 10%, transparent);
}
.admin-table-wrapper {
    width: 100%;
    overflow-x: auto;
    border-radius: 10px;
    border: 1.5px solid var(--button-border);
    background-color: var(--button-bg);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    color: var(--text-color);
    text-align: left;
}

.admin-table th {
    background-color: var(--button-border);
    color: #ffffff;
    font-weight: 700;
    padding: 16px 20px;
    font-size: 0.95rem;
    border: none;
}

.admin-table td {
    padding: 16px 20px;
    border-bottom: 1px solid color-mix(in srgb, var(--button-border) 15%, transparent);
    background-color: var(--button-bg);
    color: var(--text-color);
    vertical-align: middle;
}

.admin-table tr:last-child td {
    border-bottom: none;
}

.admin-table tr:hover td {
    background-color: color-mix(in srgb, var(--text-color) 4%, var(--button-bg));
}

.admin-product-thumb {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--button-border);
}

.admin-item-important {
    color: var(--text-color);
    font-size: 1rem;
}

.admin-item-muted {
    font-size: 0.85rem;
    color: var(--text-color);
    opacity: 0.6;
    margin-top: 2px;
}
.admin-table-empty {
    text-align: center;
    padding: 40px;
    color: var(--text-color);
    opacity: 0.5;
    font-style: italic;
}

.admin-row-btn {
    padding: 6px 14px;
    font-size: 0.85rem;
    font-weight: 700;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    margin-right: 8px;
    transition: opacity 0.2s ease, transform 0.1s ease;
}

.admin-row-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.admin-btn-menu {
    background-color: var(--button-border);
    color: #ffffff;
}

.admin-btn-edit {
    background-color: #3182ce;
    color: #ffffff;
}

.admin-btn-delete {
    background-color: #e53e3e;
    color: #ffffff;
}

.admin-loading-text {
    text-align: center;
    font-size: 1.1rem;
    margin-top: 50px;
    color: var(--text-color);
    opacity: 0.7;
}

.admin-alert-error {
    background-color: rgba(229, 62, 62, 0.15);
    color: #e53e3e;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #e53e3e;
    margin-bottom: 20px;
    font-weight: 600;
}
