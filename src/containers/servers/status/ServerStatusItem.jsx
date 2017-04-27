/* eslint-disable react/no-danger */
import React from 'react';
import { Card, Icon, Popup } from 'semantic-ui-react';
import moment from 'moment';
import './ServerStatusItem.scss';
import { STATUS } from '../../../constants/servers';

export default ({ statusFetchInProgress, handleRefresh, ...props }) => {
    let icon;
    let color;
    let detailsElement;

    switch (props.level) {
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
        default:
            break;
    }

    let iconElement = <Icon name={icon} size="big" color={color} />;

    if (props.description) {
        iconElement = (
          <Popup
                className="whitespace-pre"
                trigger={iconElement}
                content={props.description}
                hoverable
          />
        );
    }

    if (props.details) {
        detailsElement = (
          <Popup
                className="whitespace-pre"
                trigger={<Icon name="question circle" color="grey" />}
                hoverable
                wide="very"
          >
            <span className="details-content" dangerouslySetInnerHTML={{ __html: props.details }} />
          </Popup>
        );
    }

    return (
      <Card>
        <Card.Content>
          {detailsElement}
          {iconElement}
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
          <Card.Header>{props.name}</Card.Header>
          {props.updated ? <Card.Meta>Update: {moment(props.updated).format('YYYY-MM-DD H:mm:ss.SS')}</Card.Meta> : null}
        </Card.Content>
      </Card>
    );
};
