import * as SERVER from '../constants/servers';
import {isUndefined, keyBy} from 'lodash';
import {Map} from 'immutable';
import SSH from "../core/SSH";

const DEFAULT_STATE = {
    list: Map(keyBy([{'id': 1, 'name': 'Server 1'}], 'id'))
};

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SERVER.ADD:
        case SERVER.EDIT:
            if (isUndefined(action.payload)) {
                return state;
            }
            const list = state.list.set(+(action.payload.id), action.payload);
            let ssh = new SSH({
                ipAddress: 'ec2-35-162-83-152.us-west-2.compute.amazonaws.com',
                username: 'ubuntu',
                privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEArNpF2GgS9APl3nxAQnr+te5eOGtj3Fbr7zTSMnbGOf28b+in5f+T0oH0pKnT
XhWBRvR4pEsOuDz/pTB6c89bfY/3RAx+YwEOenQCsfvtUTTr4QjrnOHJpppb2IgE0qI4gyGtAP4R
9ItUIETw3vJJD5BOd1lDLUL4CeJahzcya+DQr8R3P7KrPWlLqt3r/6uBbMBA+e/KYXCuZoCBS8TN
3MOB0r4JggTHe681tN0kdaI+Be9BX1bTSEsy3nUoZiqpuZIpKBvRbMbHuY6I4uOVGGGRhqdISoYy
TyZTLu98+fzxgO+wkp5VDbPODRXPIE7M9/buSpbmckT+08S71qjoswIDAQABAoIBAEocT+QIQ1AS
N8WbmmWmnHzeldE04hz/u6rVB+aRHE6S5u9IXmxzlyqjg4PyOGjXaZVFjlBKyiXeKXHnBimPV1fP
mSG5BZtnQZDpGpq7PDYcLaJPk82w1Se0ePqu3vp8iSRYFPge9w3Vix1G0cuVMBQXOD1drTrDwtti
DJR66whrKBAYv0F2dtHcXHvRBUwIV4CJA9yWdXzimTus5FJLeVGRQ+FSozkBkVeqti19eMgau7+S
O8BfLWgBrEizZI3kYZf0XtDFcXs+L/L1xCQisAapBJmlvUwCqYdgD4sOAsRV3JcSZpArOMCKYQ9J
DJ+WgBqo2tcDhQuL44Gcwf5GvfkCgYEA3V8UoqZaSILhs36lRl3JVBYRL8xpnRUBG40hxCqx9HLA
G2JMt3u71IExyhAQnoJMtg8Ek3KwROvGC0l4lzjBApFM87XXSwCOb6hf3DRi+wkjFcRCEjMlDKdt
b8ymRUam0Fjz4xq8EUt6fhzT4hC3gHxSN8I4awY89JgQtally58CgYEAx+Q8RuY0iF7wTxzkgAOW
32ztZgUPkupi4/oV04ooXO9cR47SaqwOF1iVjAC/KiDRoOgcsaLT5Ic4k7Z68phMo+bY3flI+lcf
c7Uc3MAUDlzkyWmU6kZatcavFf4VA+Tt1zSoFpXLyhjpFBWqMru59V2UIt5aIG7yidK/BjaDCm0C
gYA7L5qiyftFe8jAZtHleFnFo4jA0NRD7UO4jAlFG20swClgqO19+RUFAe2/6n+nAYtk+artiTJb
mvX+OoyFUeU4vIRofGutX961N705cMAuAglhXnGT0BzNv03hIEQsLXGYLtA2HgW+UgHUCf0UagfF
0Hdi9QiEhMxzUNzW1Q2kXQKBgDWCm8A/EAERqTMEgQbj7xeQiVyuLiUeKart37npWjTGvuVJDnsP
5BXL2PzJlmMotfVlLYlAFYkvya2BRBh9PMcDnTqO6UJa4EiRS1Cs+rF9nKFuajbs7ouKzIQOqIGK
X0ElD3o8T3migYKm6hD6wCU3D9jlvSrBiJvslsaLATlhAoGAFHb3thtyStNSWV7Vl3cTYQEWpbWd
mmgPvaWmme6k49F+uXGC+6Xaw+WFsuB0mMmaRTY+WSJ9Yz4psicLxkOGXRIRSAFZc3rqSpKoeWmc
5GtiPBGAJX5vE3ICzjfKTjUn4/jNl+t7R/x7oIubYpXX26Jhp4+nwlDETfqPH+akR4g=
-----END RSA PRIVATE KEY-----`
            });
            ssh.setup();
            return {...state, list};
        case SERVER.FETCH:
            return {...state, list: Map(keyBy(action.payload, 'id'))};
        default:
            return state;
    }
}
;