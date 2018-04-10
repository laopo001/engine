declare namespace pc {

    namespace programlib {
        function gammaCode(value: number): string;
        function tonemapCode(value: number): string;
        function fogCode(value: string): string;
        function skinCode(device: pc.GraphicsDevice): string;
        function precisionCode(device: pc.GraphicsDevice): string;
        function versionCode(device: pc.GraphicsDevice): string;
        function dummyFragmentCode(): string;
        function begin(): string;
        function end(): string;
    }
}