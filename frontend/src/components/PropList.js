import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PropCard from './PropCard';
import React, { useState, useEffect } from 'react';
import { PrizePicksService } from '../services/prizePicksService';
export const PropList = ({ onPropSelect }) => {
    const [props, setProps] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const prizePicksService = PrizePicksService.getInstance();
        const loadProps = () => {
            const filteredProps = filter === 'all'
                ? Array.from(prizePicksService.getFilteredProps('high-confidence'))
                : prizePicksService.getFilteredProps(filter);
            setProps(filteredProps);
            setLoading(false);
        };
        loadProps();
        const interval = setInterval(loadProps, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [filter]);
    const handlePropSelect = (prop, option) => {
        onPropSelect?.(prop, option);
    };
    function mapToPrizePicksProjection(prop) {
        // Determine propType from winningProp or default to 'normal'
        const propType = prop.winningProp?.type || 'normal';
        return {
            id: prop.player_name + '_' + prop.stat_type + '_' + prop.game_time,
            playerId: prop.player_name,
            playerName: prop.player_name,
            teamAbbrev: prop.team_abbreviation,
            position: prop.position,
            statType: prop.stat_type,
            league: prop.sport,
            gameTime: prop.game_time,
            opponent: prop.opponent_team,
            projectedValue: prop.projected_value,
            lineScore: prop.line_value,
            confidence: prop.confidence_percentage,
            propType,
            fireCount: 0, // fallback, could be improved
        };
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex space-x-2 mb-4 overflow-x-auto pb-2", children: [_jsx("button", { className: `px-4 py-2 rounded-full transition-colors ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`, onClick: () => setFilter('all'), children: "All Props" }), _jsx("button", { className: `px-4 py-2 rounded-full transition-colors ${filter === 'goblins' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`, onClick: () => setFilter('goblins'), children: "Goblins" }), _jsx("button", { className: `px-4 py-2 rounded-full transition-colors ${filter === 'demons' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`, onClick: () => setFilter('demons'), children: "Demons" }), _jsx("button", { className: `px-4 py-2 rounded-full transition-colors ${filter === 'value-bets' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`, onClick: () => setFilter('value-bets'), children: "Value Bets" }), _jsx("button", { className: `px-4 py-2 rounded-full transition-colors ${filter === 'high-confidence'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'}`, onClick: () => setFilter('high-confidence'), children: "High Confidence" })] }), loading && (_jsx("div", { className: "flex justify-center items-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" }) })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: props.map(prop => {
                    const projection = mapToPrizePicksProjection(prop);
                    return (_jsx(PropCard, { isSelected: false, projection: projection, onClick: () => handlePropSelect(prop, prop.winningProp) }, projection.id));
                }) }), !loading && props.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No props found for the selected filter." }))] }));
};
export default React.memo(PropList);
