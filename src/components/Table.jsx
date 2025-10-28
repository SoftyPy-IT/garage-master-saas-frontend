/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { Pagination, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/context/PermissionContext";
import Can from "@/components/Can";
import Loading from "@/components/Loading/Loading";
const Table = ({
    title = "Table",
    columns = [],
    data = [],
    actions = [],
    loading = false,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    onSearch,
    searchPlaceholder = "Search...",
    externalHooks = {},
    renderExtraContent,
    emptyMessage = "No data found",
    getRowClass = () => ""
}) => {
    const textInputRef = useRef(null);
    const [localSearch, setLocalSearch] = useState("");
    const navigate = useNavigate();
    const { performActionWithPermission } = usePermissions();

    const handleSearch = (value) => {
        setLocalSearch(value);
        onSearch?.(value);
        if (onPageChange) onPageChange(1);
    };

    return (
        <div className="mt-5 overflow-x-auto">
            <div className="overflow-x-auto">

                <div className="flex flex-wrap items-center justify-between mb-5">
                    <h3 className="mb-3 text-xl md:text-3xl font-bold">
                        {title}: {data.length}
                    </h3>
                    {onSearch && (
                        <div className="flex items-center searcList">
                            <div className="searchGroup">
                                <input
                                    onChange={(e) => handleSearch(e.target.value)}
                                    autoComplete="off"
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    ref={textInputRef}
                                    value={localSearch}
                                />
                            </div>
                            <button className="SearchBtn">Search</button>
                        </div>
                    )}
                </div>
                {loading ? (
                    <div className="flex items-center justify-center text-xl">
                        <Loading />
                    </div>
                ) : (
                    <div>
                        {data.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-xl text-center">
                                {emptyMessage}
                            </div>
                        ) : (
                            <section className="tableContainer overflow-x-auto">
                                <table className="customTable">
                                    <thead>
                                        <tr>
                                            {columns.map((column) => (
                                                <th key={column.key}>{column.label}</th>
                                            ))}
                                            {actions.length > 0 && (
                                                <th colSpan={actions.length}>Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <TableRow
                                                key={item._id || item.id || index}
                                                data={item}
                                                index={index}
                                                columns={columns}
                                                actions={actions}
                                                currentPage={currentPage}
                                                pageSize={data.length}
                                                externalHooks={externalHooks}
                                                navigate={navigate}
                                                performActionWithPermission={performActionWithPermission}
                                                getRowClass={getRowClass}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        )}
                    </div>
                )}


                {renderExtraContent && renderExtraContent()}
                {totalPages > 1 && onPageChange && (
                    <div className="flex justify-center mt-4">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            color="primary"
                            onChange={(_, page) => onPageChange(page)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


const TableRow = ({
    data,
    index,
    columns,
    actions,
    currentPage,
    pageSize,
    externalHooks,
    navigate,
    performActionWithPermission,
    getRowClass
}) => {
    const globalIndex = (currentPage - 1) * pageSize + (index + 1);
    const rowClass = getRowClass(data);

    const renderCellContent = (column, item) => {
        if (column.type === "index") return globalIndex;

        if (column.render) return column.render(item, index, externalHooks);

        if (column.key.includes('.')) {
            return column.key.split('.').reduce((obj, key) => obj?.[key], item);
        }

        return item[column.key] ?? "N/A";
    };

    const handleActionClick = (action, item) => {
        if (action.requirePermission) {
            performActionWithPermission(
                action.permissionPage,
                action.permissionAction,
                () => {
                    if (action.onClick) action.onClick(item, { navigate, ...externalHooks });
                },
                action.permissionMessage
            );
        } else {
            if (action.onClick) action.onClick(item, { navigate, ...externalHooks });
        }
    };

    return (
        <tr className={`${rowClass} hover:bg-blue-300 transition-colors duration-200 hover:text-black`}>

            {columns.map((column) => (
                <td key={column.key}>
                    {renderCellContent(column, data)}
                </td>
            ))}

            {actions.map((action) => {
                const ActionIcon = action.icon;

                const actionContent = (
                    <Tooltip title={action.tooltip || action.label} arrow placement="top">
                        <div>
                            {action.href ? (
                                <a
                                    className={`flex flex-col items-center ${action.className || ''}`}
                                    href={typeof action.href === 'function' ? action.href(data, externalHooks) : action.href}
                                    target={action.target}
                                    rel={action.target ? "noreferrer" : undefined}
                                >
                                    <ActionIcon className={action.iconClassName || "editIcon"} />
                                </a>
                            ) : action.link ? (
                                <action.LinkComponent
                                    to={typeof action.link === 'function' ? action.link(data, externalHooks) : action.link}
                                    className={`flex flex-col items-center ${action.className || ''}`}
                                >
                                    <ActionIcon className={action.iconClassName || "editIcon"} />
                                </action.LinkComponent>
                            ) : (
                                <button
                                    onClick={() => handleActionClick(action, data)}
                                    className={`${action.className || 'flex flex-col items-center edit2'}`}
                                    style={action.style}
                                    disabled={action.disabled?.(data, externalHooks)}
                                >
                                    <ActionIcon className={action.iconClassName || "editIcon"} />
                                </button>
                            )}
                        </div>
                    </Tooltip>
                );

                return (
                    <td key={action.key}>
                        {action.requirePermission ? (
                            <Can page={action.permissionPage} action={action.permissionAction}>
                                {actionContent}
                            </Can>
                        ) : (
                            actionContent
                        )}
                    </td>
                );
            })}
        </tr>
    );
};

export default Table;