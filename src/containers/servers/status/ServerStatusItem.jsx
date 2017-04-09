import React from 'react';
import {Card, Icon, Popup} from 'semantic-ui-react';
import './ServerStatusItem.scss';
import {STATUS} from "../../../constants/servers";

export default ({level, description, name, details, statusFetchInProgress, handleRefresh}) => {
    let icon, color, details_element;

    switch (level) {
        case STATUS.OK:
            icon = 'check circle';
            color = 'green';
            break;
        case STATUS.WARNING:
            icon = 'exclamation triangle';
            color = 'yellow';
            break;
        case STATUS.ERROR:
            icon = 'exclamation circle';
            color = 'red';
            break;
        case STATUS.UNKNOWN:
            icon = 'question circle';
            color = 'grey';
            break;
    }

    let icon_element = <Icon name={icon} size="big" color={color}/>;

    if (description) {
        icon_element = (
            <Popup
                className="whitespace-pre"
                trigger={icon_element}
                content={description}
                hoverable
            />
        );
    }

    if (details) {
        details_element = (
            <Popup
                className="whitespace-pre"
                trigger={<Icon name="question circle" color="grey"/>}
                content={details}
                hoverable
            />
        );
    }

    return (
        <Card>
            <Card.Content>
                {details_element}
                {icon_element}
                <Icon
                    loading={statusFetchInProgress}
                    disabled={statusFetchInProgress}
                    onClick={handleRefresh}
                    title="Refresh"
                    className="spinner-icon pointer"
                    name="refresh"
                    size="small"
                    color="grey"
                />
                <Card.Header>{name}</Card.Header>
            </Card.Content>
        </Card>
    );
};
