document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-employee-form');
    const employeeList = document.getElementById('employee-list');
    const employeeCount = document.getElementById('employee-count');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = document.getElementById('loading-spinner');
    const formMessage = document.getElementById('form-message');

    // Navigation Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const moduleSections = document.querySelectorAll('.module-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            navBtns.forEach(b => b.classList.remove('active'));
            moduleSections.forEach(s => s.classList.add('hidden'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding module
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Fetch and display initial employees
    fetchEmployees();

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            telefono: formData.get('telefono'),
            fecha_ingreso: formData.get('fecha_ingreso')
        };

        // UI Feedback: Loading state
        setLoadingState(true);
        hideMessage();

        try {
            const response = await fetch('/api/empleados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Success: Show message, reset form, prepend new data
                showMessage('Employee added successfully!', 'success');
                form.reset();

                // Add new row creatively with animation
                const newRow = createRow(result);
                newRow.classList.add('new-record');

                // Remove 'loading/empty' row if it exists
                const loadingRow = document.getElementById('loading-row');
                if (loadingRow) loadingRow.remove();

                employeeList.insertBefore(newRow, employeeList.firstChild);
                updateCount(1);

                // Remove highlight after animation
                setTimeout(() => {
                    newRow.classList.remove('new-record');
                }, 2000);

            } else {
                // Server returned an error
                showMessage(result.error || 'Failed to add employee.', 'error');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            showMessage('A network error occurred. Please try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    });

    // Helper functions
    async function fetchEmployees() {
        try {
            const response = await fetch('/api/empleados');
            if (response.ok) {
                const employees = await response.json();
                renderEmployees(employees);
            } else {
                console.error('Failed to fetch employees');
                employeeList.innerHTML = `<tr><td colspan="3" class="text-center" style="color: var(--error-color);">Error loading data</td></tr>`;
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            employeeList.innerHTML = `<tr><td colspan="3" class="text-center" style="color: var(--error-color);">Error connecting to server</td></tr>`;
        }
    }

    function renderEmployees(employees) {
        employeeList.innerHTML = '';

        if (employees.length === 0) {
            employeeList.innerHTML = `
                <tr id="loading-row">
                    <td colspan="3" class="text-center">No employees found. Add one to get started!</td>
                </tr>
            `;
            updateCount(0, true);
            return;
        }

        employees.forEach(emp => {
            const tr = createRow(emp);
            employeeList.appendChild(tr);
        });

        updateCount(employees.length, true);
    }

    function createRow(emp) {
        const tr = document.createElement('tr');

        // Format date string nicely if possible
        let formattedDate = emp.fecha_ingreso;
        try {
            const dateObj = new Date(emp.fecha_ingreso);
            // Handling timezone issues with simple substrings if it's strictly YYYY-MM-DD
            formattedDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }).format(dateObj);
        } catch (e) {
            console.log("Date formatting failed, leaving as is", e);
        }

        tr.innerHTML = `
            <td><strong>${escapeHTML(emp.nombre)}</strong></td>
            <td>${escapeHTML(emp.telefono)}</td>
            <td class="date-cell">${formattedDate}</td>
        `;
        return tr;
    }

    function updateCount(change, absolute = false) {
        let currentCount = parseInt(employeeCount.textContent) || 0;
        let newCount = absolute ? change : currentCount + change;
        employeeCount.textContent = `${newCount} Member${newCount !== 1 ? 's' : ''}`;
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';
        } else {
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    }

    function showMessage(msg, type) {
        formMessage.textContent = msg;
        formMessage.className = `message ${type}`;
        formMessage.classList.remove('hidden');

        // Auto hide after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }

    function hideMessage() {
        formMessage.classList.add('hidden');
        formMessage.className = 'message hidden';
    }

    // Basic XSS prevention for rendering
    function escapeHTML(str) {
        if (!str) return '';
        return str.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ==========================================
    // MODULE 1: GASTOS Y PROVEEDORES LOGIC
    // ==========================================

    const addProveedorForm = document.getElementById('add-proveedor-form');
    const msgProveedor = document.getElementById('form-message-proveedor');
    const btnProveedor = document.getElementById('submit-proveedor-btn');
    const spinnerProveedor = document.getElementById('loading-spinner-proveedor');

    const addCompraForm = document.getElementById('add-compra-form');
    const msgCompra = document.getElementById('form-message-compra');
    const btnCompra = document.getElementById('submit-compra-btn');
    const spinnerCompra = document.getElementById('loading-spinner-compra');
    const proveedorSelect = document.getElementById('proveedor_id');

    const compraList = document.getElementById('compra-list');
    const compraCount = document.getElementById('compra-count');

    // Reports & Export
    const filterProveedor = document.getElementById('filter-proveedor');
    const btnExportExcel = document.getElementById('btn-export-excel');

    // Initial load for Mod 1
    fetchProveedoresAndCompras();

    // Export Logic
    if (btnExportExcel) {
        btnExportExcel.addEventListener('click', () => {
            let url = '/api/compras/export';
            const provId = filterProveedor.value;
            if (provId) {
                url += `?proveedor_id=${provId}`;
            }
            // Trigger download by setting window location or opening new tab
            window.open(url, '_blank');
        });
    }

    if (filterProveedor) {
        filterProveedor.addEventListener('change', () => {
            fetchCompras(filterProveedor.value);
        });
    }

    // Event Listeners
    if (addProveedorForm) {
        addProveedorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addProveedorForm);
            const data = {
                nombre: formData.get('nombre'),
                telefono: formData.get('telefono'),
                empresa: formData.get('empresa'),
                productos: formData.get('productos')
            };

            setLoadingStateMod(btnProveedor, spinnerProveedor, true);
            hideMessageMod(msgProveedor);

            try {
                const res = await fetch('/api/proveedores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (res.ok) {
                    showMessageMod(msgProveedor, 'Proveedor registrado con éxito', 'success');
                    addProveedorForm.reset();
                    fetchProveedoresAndCompras(); // Refresh dropdown
                } else {
                    showMessageMod(msgProveedor, result.error || 'Error al registrar', 'error');
                }
            } catch (err) {
                showMessageMod(msgProveedor, 'Error de conexión', 'error');
            } finally {
                setLoadingStateMod(btnProveedor, spinnerProveedor, false);
            }
        });
    }

    if (addCompraForm) {
        addCompraForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addCompraForm);
            const data = {
                proveedor_id: formData.get('proveedor_id'),
                monto_total: formData.get('monto_total')
            };

            setLoadingStateMod(btnCompra, spinnerCompra, true);
            hideMessageMod(msgCompra);

            try {
                const res = await fetch('/api/compras', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (res.ok) {
                    showMessageMod(msgCompra, 'Compra registrada con éxito', 'success');
                    addCompraForm.reset();
                    fetchProveedoresAndCompras(); // Refresh List
                } else {
                    showMessageMod(msgCompra, result.error || 'Error al registrar', 'error');
                }
            } catch (err) {
                showMessageMod(msgCompra, 'Error de conexión', 'error');
            } finally {
                setLoadingStateMod(btnCompra, spinnerCompra, false);
            }
        });
    }

    // Helper Functions for Module 1
    async function fetchProveedoresAndCompras() {
        try {
            // Proveedores -> Select options
            const pRes = await fetch('/api/proveedores');
            if (pRes.ok) {
                const proveedores = await pRes.json();
                populateProveedorSelect(proveedores);
            }

            // Compras -> Table
            const cRes = await fetch('/api/compras');
            if (cRes.ok) {
                const compras = await cRes.json();
                renderCompras(compras);
            }
        } catch (e) {
            console.error('Error fetching module 1 data:', e);
        }
    }

    function populateProveedorSelect(proveedores) {
        if (!proveedorSelect) return;
        proveedorSelect.innerHTML = '<option value="" disabled selected>Selecciona un proveedor</option>';
        if (filterProveedor) {
            filterProveedor.innerHTML = '<option value="">Todos los proveedores</option>';
        }

        proveedores.forEach(p => {
            const optText = `${p.nombre} ${p.empresa ? `- ${p.empresa}` : ''}`;

            // For Add Form
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = optText;
            proveedorSelect.appendChild(opt);

            // For Filter
            if (filterProveedor) {
                const fOpt = document.createElement('option');
                fOpt.value = p.id;
                fOpt.textContent = optText;
                filterProveedor.appendChild(fOpt);
            }
        });
    }

    async function fetchCompras(proveedorId = '') {
        try {
            let url = '/api/compras';
            if (proveedorId) {
                // Actually the API currently returns all, but we can filter on the client
                // Or if we updated the API to handle the query string, we should append it
                url += `?proveedor_id=${proveedorId}`;
            }

            const cRes = await fetch(url);
            if (cRes.ok) {
                const compras = await cRes.json();

                // Client-side filtering if the API returns all (which it does not do by default for GET without ? filtering)
                // Let's just do client-side filtering for robustness here:
                let filteredCompras = compras;
                if (proveedorId) {
                    filteredCompras = compras.filter(c => c.proveedor_id === proveedorId);
                }

                renderCompras(filteredCompras);
            }
        } catch (e) {
            console.error('Error fetching compras for filter:', e);
        }
    }

    function renderCompras(compras) {
        if (!compraList) return;

        compraList.innerHTML = '';
        if (compras.length === 0) {
            compraList.innerHTML = `<tr id="loading-row-compras"><td colspan="3" class="text-center">No hay compras registradas.</td></tr>`;
            if (compraCount) compraCount.textContent = '0 Compras';
            return;
        }

        compras.forEach(c => {
            const tr = document.createElement('tr');

            let dateStr = c.fecha;
            try {
                const d = new Date(c.fecha);
                dateStr = new Intl.DateTimeFormat('es-MX', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }).format(d);
            } catch (e) { }

            const provName = c.Proveedores ? c.Proveedores.nombre : 'Desconocido';
            const mnt = parseFloat(c.monto_total).toFixed(2);

            tr.innerHTML = `
                <td class="date-cell">${dateStr}</td>
                <td><strong>${escapeHTML(provName)}</strong></td>
                <td>$${mnt}</td>
            `;
            compraList.appendChild(tr);
        });

        if (compraCount) {
            compraCount.textContent = `${compras.length} Compra${compras.length !== 1 ? 's' : ''}`;
        }
    }

    function setLoadingStateMod(btn, spin, isLoading) {
        if (!btn || !spin) return;
        const txt = btn.querySelector('.btn-text');
        if (isLoading) {
            if (txt) txt.classList.add('hidden');
            spin.classList.remove('hidden');
            btn.disabled = true;
            btn.style.opacity = '0.8';
        } else {
            if (txt) txt.classList.remove('hidden');
            spin.classList.add('hidden');
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    }

    function showMessageMod(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.className = `message ${type}`;
        el.classList.remove('hidden');
        if (type === 'success') {
            setTimeout(() => { hideMessageMod(el); }, 5000);
        }
    }

    function hideMessageMod(el) {
        if (!el) return;
        el.className = 'message hidden';
    }
});
